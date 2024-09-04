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

from os import PathLike

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
