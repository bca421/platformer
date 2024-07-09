import pygame
import kivy
from kivy.app import App
from kivy.uix.widget import Widget
from kivy.graphics import Rectangle
from kivy.core.window import Window
from kivy.clock import Clock

# Initialize Pygame
pygame.init()

# Constants
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600
PLAYER_SPEED = 5
GRAVITY = 1
JUMP_STRENGTH = 15

# Load Assets
background = pygame.image.load("/Documents/platformer/bg_castle.png")
player_spritesheet = pygame.image.load("/Documents/platformer/p1_spritesheet.png")

# Player Class
class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.images = {
            "walk": [player_spritesheet.subsurface(pygame.Rect(x, y, w, h)) for x, y, w, h in [
                (0, 0, 72, 97), (73, 0, 72, 97), (146, 0, 72, 97), (0, 98, 72, 97),
                (73, 98, 72, 97), (146, 98, 72, 97), (219, 0, 72, 97), (292, 0, 72, 97),
                (219, 98, 72, 97), (365, 0, 72, 97), (292, 98, 72, 97)
            ]],
            "stand": player_spritesheet.subsurface(pygame.Rect(67, 196, 66, 92))
        }
        self.image = self.images["stand"]
        self.rect = self.image.get_rect()
        self.rect.topleft = (50, 400)
        self.velocity_y = 0
        self.jumping = False

    def update(self, keys):
        if keys[pygame.K_LEFT]:
            self.rect.x -= PLAYER_SPEED
        if keys[pygame.K_RIGHT]:
            self.rect.x += PLAYER_SPEED
        if keys[pygame.K_SPACE] and not self.jumping:
            self.jumping = True
            self.velocity_y = -JUMP_STRENGTH

        # Gravity
        self.velocity_y += GRAVITY
        self.rect.y += self.velocity_y

        # Check for collision with the ground
        if self.rect.bottom >= WINDOW_HEIGHT:
            self.rect.bottom = WINDOW_HEIGHT
            self.jumping = False

# Kivy Widget
class GameWidget(Widget):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.canvas.add(Rectangle(source="/Documents/platformer/bg_castle.png", pos=(0, 0), size=(WINDOW_WIDTH, WINDOW_HEIGHT)))
        self.player = Player()
        self.all_sprites = pygame.sprite.Group(self.player)

    def update(self, dt):  # dt is the delta time between frames, but not used here
        keys = pygame.key.get_pressed()
        self.all_sprites.update(keys)
        self.render()

    def render(self):
        self.canvas.clear()
        self.canvas.add(Rectangle(source="/Documents/platformer/bg_castle.png", pos=(0, 0), size=(WINDOW_WIDTH, WINDOW_HEIGHT)))
        for entity in self.all_sprites:
            entity_surface = pygame.image.tostring(entity.image, "RGBA", False)
            entity_texture = kivy.core.image.Image(entity_surface, (entity.rect.width, entity.rect.height)).texture
            self.canvas.add(Rectangle(texture=entity_texture, pos=(entity.rect.x, WINDOW_HEIGHT - entity.rect.y), size=(entity.rect.width, entity.rect.height)))

# Kivy App
class PlatformerApp(App):
    def build(self):
        game = GameWidget()
        Clock.schedule_interval(game.update, 1.0 / 60.0)
        return game

if __name__ == "__main__":
    PlatformerApp().run()
