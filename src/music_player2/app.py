# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

import argparse
from os import PathLike
from pathlib import Path

from flask import Flask, render_template, send_file

from .db import ITEMS


def create_app(template_folder: PathLike[str], static_folder: PathLike[str]) -> Flask:
    app = Flask(__name__, template_folder=template_folder, static_folder=static_folder)

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/musiclist")
    def return_list():
        return ITEMS

    @app.route("/music/<int:id>")
    def return_music(id: int):
        return send_file(ITEMS[id].path)

    return app


def main():
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
