from flask import Flask, render_template, request, jsonify
from game import Game

app = Flask(__name__)
game_mode = 'easy'
game = Game(width=20, height=20, difficulty=game_mode)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/state')
def state():
    return jsonify(game.get_state())

@app.route('/start')
def start():
    global game_mode
    # Берём difficulty= из URL
    difficulty = request.args.get('difficulty', game_mode)
    # Валидируем
    if difficulty not in ['easy', 'hard']:
        difficulty = 'easy'
    # Запоминаем текущий режим и сбрасываем игру
    game_mode = difficulty
    game.reset(game_mode)
    return jsonify(success=True)


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

@app.route('/restart', methods=['POST'])
def restart():
    global game, game_mode
    data = request.get_json()
    difficulty = data.get('mode', 'easy')
    if difficulty not in ['easy', 'hard']:
        difficulty = 'easy'
    game_mode = difficulty  # ← сохраняем выбранный режим
    game = Game(width=20, height=20, difficulty=game_mode)
    return '', 204


if __name__ == '__main__':
    app.run(debug=True)
