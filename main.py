from flask import Flask, render_template, request, jsonify
from game import Game

app = Flask(__name__)
game = Game(width=20, height=20)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/state')
def state():
    return jsonify(game.get_state())

@app.route('/move', methods=['POST'])
def move():
    direction = request.json.get('direction')
    game.change_direction(direction)
    game.update()
    return jsonify(success=True)

@app.route('/restart')
def restart():
    game.reset()
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(debug=True)
