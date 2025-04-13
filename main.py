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

    directions = {
        'UP': (0, -1),
        'DOWN': (0, 1),
        'LEFT': (-1, 0),
        'RIGHT': (1, 0)
    }

    if direction in directions:
        dx, dy = directions[direction]
        game.change_direction(dx, dy)

    game.move()
    return jsonify(success=True)


@app.route('/restart')
def restart():
    game.reset()
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(debug=True)
