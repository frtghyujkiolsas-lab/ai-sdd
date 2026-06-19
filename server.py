#!/usr/bin/env python3
from __future__ import annotations

import base64
import cgi
import html
import json
import mimetypes
import os
import subprocess
import sys
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib import request


ROOT = Path(__file__).resolve().parent
UPLOADS_DIR = ROOT / "uploads"
GENERATED_DIR = ROOT / "generated"
TEMPLATE_PATH = ROOT / "templates" / "badge-dynamic.html"
HIVISION_BASE = os.environ.get("HIVISION_BASE", "http://localhost:8080").rstrip("/")
CHROME = os.environ.get("CHROME_PATH", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
PORT = int(os.environ.get("PORT", "8888"))
HOST = os.environ.get("HOST", "127.0.0.1")

UPLOADS_DIR.mkdir(exist_ok=True)
GENERATED_DIR.mkdir(exist_ok=True)


def make_multipart(fields: dict[str, object]) -> tuple[bytes, str]:
    boundary = "----CodexBoundary" + uuid.uuid4().hex
    body = bytearray()
    for key, value in fields.items():
        if isinstance(value, tuple):
            filename, content, content_type = value
            body.extend(
                (
                    f"--{boundary}\r\n"
                    f'Content-Disposition: form-data; name="{key}"; filename="{filename}"\r\n'
                    f"Content-Type: {content_type}\r\n\r\n"
                ).encode("utf-8")
            )
            body.extend(content)
            body.extend(b"\r\n")
        else:
            body.extend(
                (
                    f"--{boundary}\r\n"
                    f'Content-Disposition: form-data; name="{key}"\r\n\r\n'
                    f"{value}\r\n"
                ).encode("utf-8")
            )
    body.extend(f"--{boundary}--\r\n".encode("utf-8"))
    return bytes(body), boundary


def post_multipart(url: str, fields: dict[str, object], timeout: int = 90) -> dict:
    body, boundary = make_multipart(fields)
    req = request.Request(
        url,
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    with request.urlopen(req, timeout=timeout) as resp:
        payload = resp.read()
    return json.loads(payload)


def decode_data_url(data_url: str) -> bytes:
    payload = data_url.split(",", 1)[1] if "," in data_url else data_url
    return base64.b64decode(payload)


def write_data_url(path: Path, data_url: str) -> None:
    path.write_bytes(decode_data_url(data_url))


def render_badge_html(task_id: str, id_photo_data_url: str, employee: dict[str, str]) -> Path:
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    values = {
        "{{ID_PHOTO}}": id_photo_data_url,
        "{{NAME}}": html.escape(employee.get("name") or "Demo User"),
        "{{DEPARTMENT}}": html.escape(employee.get("department") or "产品部"),
        "{{POSITION}}": html.escape(employee.get("position") or "AI产品经理"),
        "{{EMPLOYEE_ID}}": html.escape(employee.get("employeeId") or "XM-2026-001"),
    }
    for key, value in values.items():
        template = template.replace(key, value)
    html_path = GENERATED_DIR / f"{task_id}-badge.html"
    html_path.write_text(template, encoding="utf-8")
    return html_path


def chrome_screenshot(html_path: Path, output_path: Path) -> None:
    if not Path(CHROME).exists():
        raise RuntimeError(f"Chrome not found: {CHROME}")
    subprocess.run(
        [
            CHROME,
            "--headless",
            "--disable-gpu",
            "--hide-scrollbars",
            "--force-device-scale-factor=2",
            "--window-size=900,1200",
            f"--screenshot={output_path}",
            html_path.as_uri(),
        ],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )


def create_badge(photo_bytes: bytes, filename: str, employee: dict[str, str]) -> dict:
    task_id = uuid.uuid4().hex[:12]
    content_type = mimetypes.guess_type(filename)[0] or "image/png"
    original_path = UPLOADS_DIR / f"{task_id}-{Path(filename).name}"
    original_path.write_bytes(photo_bytes)

    id_result = post_multipart(
        f"{HIVISION_BASE}/idphoto",
        {
            "input_image": (filename, photo_bytes, content_type),
            "height": "413",
            "width": "295",
            "hd": "true",
            "dpi": "300",
            "brightness_strength": "0",
            "contrast_strength": "0",
            "sharpen_strength": "0",
            "saturation_strength": "0",
        },
    )
    if not id_result.get("status"):
        raise RuntimeError(f"Hivision /idphoto failed: {id_result}")

    transparent_photo = id_result.get("image_base64_standard") or id_result.get("image_base64_hd")
    if not transparent_photo:
        raise RuntimeError("Hivision /idphoto did not return image_base64_standard")

    bg_result = post_multipart(
        f"{HIVISION_BASE}/add_background",
        {
            "input_image_base64": transparent_photo,
            "color": "ffffff",
            "dpi": "300",
            "render": "0",
        },
    )
    if not bg_result.get("status") or not bg_result.get("image_base64"):
        raise RuntimeError(f"Hivision /add_background failed: {bg_result}")

    id_photo_data_url = bg_result["image_base64"]
    id_photo_path = GENERATED_DIR / f"{task_id}-id-photo.png"
    badge_path = GENERATED_DIR / f"{task_id}-badge.png"
    write_data_url(id_photo_path, id_photo_data_url)

    badge_html = render_badge_html(task_id, id_photo_data_url, employee)
    chrome_screenshot(badge_html, badge_path)

    badge_data_url = "data:image/png;base64," + base64.b64encode(badge_path.read_bytes()).decode("ascii")
    return {
        "task_id": task_id,
        "id_photo": id_photo_data_url,
        "badge_png": badge_data_url,
        "files": {
            "original": str(original_path),
            "id_photo": str(id_photo_path),
            "badge": str(badge_path),
            "html": str(badge_html),
        },
    }


class Handler(BaseHTTPRequestHandler):
    server_version = "XianmaBadgeServer/0.1"

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.end_headers()

    def do_GET(self) -> None:
        if self.path == "/health":
            self.send_json({"ok": True, "hivision": HIVISION_BASE})
            return
        self.send_error(404, "Not Found")

    def do_POST(self) -> None:
        if self.path != "/api/generate":
            self.send_error(404, "Not Found")
            return
        try:
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={
                    "REQUEST_METHOD": "POST",
                    "CONTENT_TYPE": self.headers.get("Content-Type", ""),
                },
            )
            photo = form["photo"] if "photo" in form else None
            if photo is None or not getattr(photo, "file", None):
                raise ValueError("Missing photo file")

            employee = {
                "name": form.getfirst("name", ""),
                "department": form.getfirst("department", ""),
                "position": form.getfirst("position", ""),
                "employeeId": form.getfirst("employeeId", ""),
            }
            filename = photo.filename or "upload.png"
            result = create_badge(photo.file.read(), filename, employee)
            self.send_json(result)
        except Exception as exc:
            self.send_json({"error": str(exc)}, status=500)

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("%s - - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), fmt % args))

    def send_json(self, payload: dict, status: int = 200) -> None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def main() -> None:
    print(f"Xianma badge server: http://{HOST}:{PORT}")
    print(f"HivisionIDPhotos: {HIVISION_BASE}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()


if __name__ == "__main__":
    main()
