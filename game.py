import random

class Snake:
    def __init__(self, start_pos=(5, 5)):
        self.body = [start_pos]
        self.direction = (1, 0)  # движение вправо по умолчанию
        self.grow_pending = False

    def set_direction(self, dx, dy):
        if (dx, dy) != (-self.direction[0], -self.direction[1]):
            self.direction = (dx, dy)

    def move(self, width, height, wrap=False):
        head_x, head_y = self.body[0]
        dx, dy = self.direction
        new_head = (head_x + dx, head_y + dy)

        if wrap:
            new_head = (new_head[0] % width, new_head[1] % height)
        
        self.body.insert(0, new_head)
        if not self.grow_pending:
            self.body.pop()
        else:
            self.grow_pending = False

    def grow(self):
        self.grow_pending = True

    def get_head(self):
        return self.body[0]

    def collides_with_self(self):
        return self.get_head() in self.body[1:]


class Game:
    def __init__(self, width=20, height=20, difficulty='easy'):
        self.width = width
        self.height = height
        self.difficulty = difficulty
        self.reset(difficulty)

    def reset(self, difficulty='easy'):
        self.difficulty = difficulty
        self.snake = Snake()
        self.score = 0
        self.game_over = False
        self.food = None
        self.bombs = []
        self.spawn_food()
        self.spawn_bombs()

    def change_direction(self, dx, dy):
        self.snake.set_direction(dx, dy)

    def spawn_food(self):
        while True:
            pos = (random.randint(0, self.width - 1), random.randint(0, self.height - 1))
            if pos not in self.snake.body and pos not in self.bombs:
                self.food = pos
                break
            
    def spawn_bombs(self):
        count = 3 if self.difficulty == 'easy' else 6

        head_x, head_y = self.snake.get_head()
        dx, dy = self.snake.direction
        
        if self.difficulty == 'easy':
            forbidden = ((head_x + dx) % self.width, (head_y + dy) % self.height)
        else:
            forbidden = (head_x + dx, head_y + dy)

        self.bombs = []
        while len(self.bombs) < count:
            pos = (random.randint(0, self.width - 1),
                random.randint(0, self.height - 1))

            if (pos not in self.snake.body
                and pos != self.food
                and pos != forbidden
                and pos not in self.bombs):
                self.bombs.append(pos)
            

    def move(self):
        if self.game_over:
            return

        head_x, head_y = self.snake.get_head()
        dx, dy = self.snake.direction
        new_head = (head_x + dx, head_y + dy)

        if not (0 <= new_head[0] < self.width) or not (0 <= new_head[1] < self.height):
            if self.difficulty == 'easy':
                wrap = True
            else:
                self.game_over = True
                return
        else:
            wrap = False

        if new_head in self.snake.body:
            self.game_over = True
            return

        if new_head in self.bombs:
            self.game_over = True
            return

        self.snake.move(self.width, self.height, wrap)

        if self.snake.get_head() == self.food:
            self.snake.grow()
            self.score += 1
            self.spawn_food()
            self.spawn_bombs()

    def get_state(self):
        return {
            'snake': self.snake.body,
            'food': self.food,
            'bombs': self.bombs,
            'game_over': self.game_over,
            'score': self.score,
            'direction': self.snake.direction
        }
