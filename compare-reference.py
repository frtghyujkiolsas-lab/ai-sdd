#!/usr/bin/env python3
"""Compare the rendered badge with a reference image.

This script intentionally avoids third-party dependencies. It uses macOS `sips`
to normalize both images to PNG at the same size, then compares pixels with a
mean absolute difference score.
"""

from __future__ import annotations

import argparse
import os
import struct
import subprocess
import tempfile
import zlib
from pathlib import Path


PNG_SIG = b"\x89PNG\r\n\x1a\n"


def normalize_with_sips(src: Path, width: int, height: int, out: Path) -> None:
    subprocess.run(
        [
            "sips",
            "-s",
            "format",
            "png",
            "-z",
            str(height),
            str(width),
            str(src),
            "--out",
            str(out),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def paeth(a: int, b: int, c: int) -> int:
    p = a + b - c
    pa = abs(p - a)
    pb = abs(p - b)
    pc = abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    if pb <= pc:
        return b
    return c


def png_chunk(chunk_type: bytes, chunk_data: bytes) -> bytes:
    return (
        struct.pack(">I", len(chunk_data))
        + chunk_type
        + chunk_data
        + struct.pack(">I", zlib.crc32(chunk_type + chunk_data) & 0xFFFFFFFF)
    )


def write_png_rgb(path: Path, width: int, height: int, rgb: bytes) -> None:
    stride = width * 3
    raw = bytearray()
    for y in range(height):
        raw.append(0)
        start = y * stride
        raw.extend(rgb[start : start + stride])

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    path.write_bytes(
        PNG_SIG
        + png_chunk(b"IHDR", ihdr)
        + png_chunk(b"IDAT", zlib.compress(bytes(raw), level=9))
        + png_chunk(b"IEND", b"")
    )


def read_png_rgb(path: Path) -> tuple[int, int, bytes]:
    data = path.read_bytes()
    if not data.startswith(PNG_SIG):
        raise ValueError(f"{path} is not a PNG file")

    pos = len(PNG_SIG)
    width = height = None
    color_type = None
    bit_depth = None
    idat = bytearray()

    while pos < len(data):
        length = struct.unpack(">I", data[pos : pos + 4])[0]
        chunk_type = data[pos + 4 : pos + 8]
        chunk_data = data[pos + 8 : pos + 8 + length]
        pos += 12 + length

        if chunk_type == b"IHDR":
            width, height, bit_depth, color_type, compression, filter_method, interlace = struct.unpack(
                ">IIBBBBB", chunk_data
            )
            if bit_depth != 8 or compression != 0 or filter_method != 0 or interlace != 0:
                raise ValueError(f"Unsupported PNG format in {path}")
            if color_type not in (2, 6):
                raise ValueError(f"Unsupported PNG color type {color_type} in {path}")
        elif chunk_type == b"IDAT":
            idat.extend(chunk_data)
        elif chunk_type == b"IEND":
            break

    if width is None or height is None or color_type is None:
        raise ValueError(f"Missing PNG header in {path}")

    channels = 4 if color_type == 6 else 3
    stride = width * channels
    raw = zlib.decompress(bytes(idat))
    rows: list[bytearray] = []
    i = 0

    for _ in range(height):
        filter_type = raw[i]
        i += 1
        scan = bytearray(raw[i : i + stride])
        i += stride
        prev = rows[-1] if rows else bytearray(stride)

        for x in range(stride):
            left = scan[x - channels] if x >= channels else 0
            up = prev[x]
            up_left = prev[x - channels] if x >= channels else 0

            if filter_type == 1:
                scan[x] = (scan[x] + left) & 0xFF
            elif filter_type == 2:
                scan[x] = (scan[x] + up) & 0xFF
            elif filter_type == 3:
                scan[x] = (scan[x] + ((left + up) // 2)) & 0xFF
            elif filter_type == 4:
                scan[x] = (scan[x] + paeth(left, up, up_left)) & 0xFF
            elif filter_type != 0:
                raise ValueError(f"Unsupported PNG filter {filter_type} in {path}")
        rows.append(scan)

    rgb = bytearray(width * height * 3)
    out_i = 0
    for row in rows:
        for x in range(0, len(row), channels):
            rgb[out_i : out_i + 3] = row[x : x + 3]
            out_i += 3
    return width, height, bytes(rgb)


def build_heatmap(ref: bytes, cand: bytes) -> bytes:
    heat = bytearray(len(ref))
    for i in range(0, len(ref), 3):
        delta = (abs(ref[i] - cand[i]) + abs(ref[i + 1] - cand[i + 1]) + abs(ref[i + 2] - cand[i + 2])) // 3
        intensity = min(255, delta * 4)
        heat[i] = intensity
        heat[i + 1] = max(0, intensity // 5)
        heat[i + 2] = max(0, 255 - intensity) if intensity > 28 else 0
    return bytes(heat)


def similarity(
    reference: Path,
    candidate: Path,
    width: int,
    height: int,
    diff_out: Path | None = None,
) -> tuple[float, float]:
    with tempfile.TemporaryDirectory() as td:
        ref_png = Path(td) / "reference.png"
        cand_png = Path(td) / "candidate.png"
        normalize_with_sips(reference, width, height, ref_png)
        normalize_with_sips(candidate, width, height, cand_png)
        _, _, ref = read_png_rgb(ref_png)
        _, _, cand = read_png_rgb(cand_png)

    total = len(ref) * 255
    diff = sum(abs(a - b) for a, b in zip(ref, cand))
    mad = diff / len(ref)
    score = max(0.0, 100.0 * (1.0 - diff / total))

    if diff_out:
        diff_out.parent.mkdir(parents=True, exist_ok=True)
        write_png_rgb(diff_out, width, height, build_heatmap(ref, cand))

    return score, mad


def main() -> None:
    parser = argparse.ArgumentParser(description="Compare badge render with a reference image.")
    parser.add_argument("reference", type=Path, help="Path to the reference image")
    parser.add_argument("candidate", type=Path, help="Path to the rendered candidate image")
    parser.add_argument("--width", type=int, default=900)
    parser.add_argument("--height", type=int, default=1200)
    parser.add_argument("--diff-out", type=Path, help="Optional path to write a red/blue difference heatmap")
    args = parser.parse_args()

    if not args.reference.exists():
        raise SystemExit(f"Reference not found: {args.reference}")
    if not args.candidate.exists():
        raise SystemExit(f"Candidate not found: {args.candidate}")
    if not Path("/usr/bin/sips").exists() and not any(
        (Path(p) / "sips").exists() for p in os.environ.get("PATH", "").split(os.pathsep)
    ):
        raise SystemExit("macOS `sips` command not found")

    score, mad = similarity(args.reference, args.candidate, args.width, args.height, args.diff_out)
    print(f"Similarity: {score:.4f}%")
    print(f"Mean absolute RGB difference: {mad:.4f} / 255")
    if args.diff_out:
        print(f"Diff heatmap: {args.diff_out}")
    if score >= 99:
        print("Result: PASS >= 99%")
    else:
        print("Result: NEEDS ITERATION < 99%")


if __name__ == "__main__":
    main()
