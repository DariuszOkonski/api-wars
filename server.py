from flask import Flask, render_template, request, redirect, url_for

import data_connection
import data_manager
from util import json_response

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/register' , methods=["POST", "GET"])
def register():

    if request.method == "GET":
        return render_template('register.html')
    else:
        data_manager.create_user(request.form)
        return redirect(url_for('home'))


@app.route('/login', methods=["GET"])
def login():
    return render_template('login.html')


@app.route('/login', methods=["POST"])
def post_login():

    if data_manager.validate_user(request.form):
        data_manager.set_session(request.form.get('login'))
        return redirect(url_for('home'))



if __name__ == '__main__':
    app.run(debug=True)