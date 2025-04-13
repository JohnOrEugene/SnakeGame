import random

class Snake:
    def __init__(self):
        self.body = [(5, 5)]
        self.direction = 'RIGHT'
        self.grow_pending = False

    def change_direction(self, direction):
        opposite = {'UP': 'DOWN', 'DOWN': 'UP', 'LEFT': 'RIGHT', 'RIGHT': 'LEFT'}
        if direction != opposite.get(self.direction):
            self.direction = direction

    def move(self):
        head_x, head_y = self.body[0]
        delta = {'UP': (0, -1), 'DOWN': (0, 1), 'LEFT': (-1, 0), 'RIGHT': (1, 0)}
        dx, dy = delta[self.direction]
        new_head = (head_x + dx, head_y + dy)
        self.body.insert(0, new_head)
        if not self.grow_pending:
            self.body.pop()
        else:
            self.grow_pending = False

    def grow(self):
        self.grow_pending = True

    def collides_with_self(self):
        return self.body[0] in self.body[1:]

    def get_head(self):
        return self.body[0]

class Food:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.position = self.random_position()

    def random_position(self):
        return (random.randint(0, self.width - 1), random.randint(0, self.height - 1))

class Game:
    def __init__(self, width=20, height=20):
        self.width = width
        self.height = height
        self.reset()

    def reset(self):
        self.snake = [(5, 5)]
        self.direction = (0, 1)
        self.spawn_food()
        self.game_over = False
        self.score = 0

    def spawn_food(self):
        import random
        while True:
            self.food = (random.randint(0, self.width - 1), random.randint(0, self.height - 1))
            if self.food not in self.snake:
                break

    def move(self):
        if self.game_over:
            return

        head = self.snake[0]
        new_head = (head[0] + self.direction[0], head[1] + self.direction[1])

        if (new_head in self.snake or
            not (0 <= new_head[0] < self.width) or
            not (0 <= new_head[1] < self.height)):
            self.game_over = True
            return

        self.snake.insert(0, new_head)
        if new_head == self.food:
            self.spawn_food()
            self.score += 1
        else:
            self.snake.pop()

    def change_direction(self, dx, dy):
        if (dx, dy) != (-self.direction[0], -self.direction[1]):
            self.direction = (dx, dy)

    def get_state(self):
        return {
            'snake': self.snake,
            'food': self.food,
            'game_over': self.game_over,
            'score': self.score
        }

