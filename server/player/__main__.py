import argparse
from pathlib import Path

from .app import create_app

parser = argparse.ArgumentParser(prog=__package__, description="Web Music Player")
parser.add_argument("template_folder", type=Path, help="Template folder")
parser.add_argument("static_folder", type=Path, help="Static folder")
parser.add_argument("--debug", action="store_true", help="Debug mode")
args = parser.parse_args()

template_folder: Path = args.template_folder
static_folder: Path = args.static_folder
debug: bool = args.debug

app = create_app(template_folder, template_folder / static_folder)
# print(f"Template folder: {app.template_folder}")
# print(f"Static folder: {app.static_folder}")

if debug:
    app.run(debug=True)
else:
    import socket

    from waitress import serve

    host = socket.gethostbyname(socket.gethostname())
    port = 80
    print(f"Server is running on http://{host}:{port}")
    serve(app, host=host, port=port, threads=4)
