import sys
import random
import time
import math
import os
from collections import defaultdict
from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
                            QSlider, QLabel, QPushButton, QGroupBox, QGridLayout)
from PyQt5.QtCore import Qt, QTimer, QRectF, QPointF
from PyQt5.QtGui import QPainter, QColor, QBrush, QPen, QRadialGradient, QFont, QIcon

class Particle:
    __slots__ = ('x', 'y', 'type', 'vx', 'vy', 'connections', 'entangled',
                 'color', 'size', 'weight', 'canvas_width', 'canvas_height', 'id')

    def __init__(self, x, y, particle_type, canvas_width, canvas_height, pid):
        self.x = x
        self.y = y
        self.type = particle_type
        self.vx = (random.random() - 0.5) * 3
        self.vy = (random.random() - 0.5) * 3
        self.connections = []
        self.entangled = []
        self.id = pid

        # Particle type properties
        if particle_type == "CONSCIOUS":
            self.color = (52, 152, 219)
            self.size = 3.0
            self.weight = 0.8
        elif particle_type == "LIFE":
            self.color = (233, 30, 99)
            self.size = 2.5
            self.weight = 0.9
        else:  # "ELEMENT"
            self.color = (46, 204, 113)
            self.size = 2.0
            self.weight = 1.0

        self.canvas_width = canvas_width
        self.canvas_height = canvas_height

    def update_position(self, divine_center, divine_force, gravity, velocity):
        # Apply divine force (pull toward center)
        dx = divine_center.x() - self.x
        dy = divine_center.y() - self.y
        distance = math.sqrt(dx*dx + dy*dy)

        if distance > 5:
            force = divine_force * (1 - (min(distance, 300) / 300))
            self.vx += (dx / distance) * force * self.weight
            self.vy += (dy / distance) * force * self.weight

        # Apply velocity
        self.x += self.vx * velocity
        self.y += self.vy * velocity

        # Apply gravity
        self.vy += gravity

        # Boundary collision with damping
        if self.x < 0 or self.x > self.canvas_width:
            self.vx *= -0.8
        if self.y < 0 or self.y > self.canvas_height:
            self.vy *= -0.8

        # Keep within bounds
        self.x = max(0, min(self.canvas_width, self.x))
        self.y = max(0, min(self.canvas_height, self.y))

        # Clear connections for this frame
        self.connections = []

class SpatialGrid:
    def __init__(self, width, height, cell_size=100):
        self.cell_size = cell_size
        self.width = width
        self.height = height
        self.cols = int(math.ceil(width / cell_size))
        self.rows = int(math.ceil(height / cell_size))
        self.grid = defaultdict(list)
        self.cell_size = cell_size

    def clear(self):
        self.grid.clear()

    def add_particle(self, particle):
        col = int(particle.x / self.cell_size)
        row = int(particle.y / self.cell_size)
        self.grid[(col, row)].append(particle)

    def get_nearby_particles(self, particle):
        col = int(particle.x / self.cell_size)
        row = int(particle.y / self.cell_size)

        nearby = []
        for c in range(max(0, col-1), min(self.cols, col+2)):
            for r in range(max(0, row-1), min(self.rows, row+2)):
                nearby.extend(self.grid.get((c, r), []))
        return nearby

class UniverseWidget(QWidget):
    def __init__(self, settings, parent=None):
        super().__init__(parent)
        self.settings = settings
        self.particles = []
        self.entangled_pairs = []
        self.divine_center = QPointF(0, 0)
        self.interaction_count = 0
        self.entangled_count = 0
        self.meditation_mode = False
        self.last_update_time = time.time()
        self.fps = 60
        self.setMinimumSize(800, 600)
        self.grid = SpatialGrid(self.width(), self.height())
        self.next_particle_id = 0

        # Initialize with 500 particles
        self.reset_universe(500)

        # Animation timer
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_particles)
        self.timer.start(16)  # ~60 FPS

    def reset_universe(self, particle_count):
        self.particles = []
        self.entangled_pairs = []
        self.interaction_count = 0
        self.entangled_count = 0
        self.next_particle_id = 0

        # Create divine center at canvas center
        self.divine_center = QPointF(self.width() / 2, self.height() / 2)

        # Create particles
        types = ["CONSCIOUS", "LIFE", "ELEMENT"]
        for _ in range(particle_count):
            self.add_particle(types)

        # Create entangled pairs
        self.create_entangled_pairs(self.settings.entanglement / 100.0)

        # Update the spatial grid
        self.grid = SpatialGrid(self.width(), self.height())
        for particle in self.particles:
            self.grid.add_particle(particle)

    def add_particle(self, types):
        p_type = random.choice(types)
        particle = Particle(
            random.uniform(0, self.width()),
            random.uniform(0, self.height()),
            p_type,
            self.width(),
            self.height(),
            self.next_particle_id
        )
        self.particles.append(particle)
        self.next_particle_id += 1
        return particle

    def create_entangled_pairs(self, probability):
        self.entangled_pairs = []
        self.entangled_count = 0

        # Only create entangled pairs for a subset of particles
        # to improve performance with large numbers
        max_particles = min(5000, len(self.particles))

        for i in range(max_particles):
            for j in range(i + 1, max_particles):
                if random.random() < probability:
                    self.entangled_pairs.append({
                        'a': self.particles[i],
                        'b': self.particles[j],
                        'strength': 0.5 + random.random() * 0.5
                    })
                    self.entangled_count += 1

    def add_particles(self, count):
        types = ["CONSCIOUS", "LIFE", "ELEMENT"]
        for _ in range(count):
            self.add_particle(types)

        # Update entangled pairs for new particles
        self.create_entangled_pairs(self.settings.entanglement / 100.0)

        # Update the spatial grid
        self.grid.clear()
        for particle in self.particles:
            self.grid.add_particle(particle)

    def update_particles(self):
        # Calculate FPS
        current_time = time.time()
        delta = current_time - self.last_update_time
        self.fps = 1 / delta if delta > 0 else 60
        self.last_update_time = current_time

        # Update particle positions
        self.interaction_count = 0
        for particle in self.particles:
            particle.update_position(
                self.divine_center,
                self.settings.divine_force,
                self.settings.gravity,
                self.settings.velocity
            )

        # Update spatial grid
        self.grid.clear()
        for particle in self.particles:
            self.grid.add_particle(particle)

        # Calculate proximity interactions using spatial grid
        for particle in self.particles:
            nearby = self.grid.get_nearby_particles(particle)
            for other in nearby:
                if particle.id < other.id:  # Only check each pair once
                    dx = particle.x - other.x
                    dy = particle.y - other.y
                    distance = math.sqrt(dx*dx + dy*dy)

                    if distance < self.settings.interaction_distance:
                        particle.connections.append(other)
                        other.connections.append(particle)
                        self.interaction_count += 1

        self.update()

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)

        # Fill background
        painter.fillRect(self.rect(), QColor(10, 10, 25))

        # Draw divine center
        gradient = QRadialGradient(
            self.divine_center,
            80,
            self.divine_center
        )
        gradient.setColorAt(0, QColor(157, 89, 182, 200))
        gradient.setColorAt(1, QColor(157, 89, 182, 0))
        painter.setBrush(QBrush(gradient))
        painter.setPen(Qt.NoPen)
        painter.drawEllipse(self.divine_center, 80, 80)

        # Draw entangled connections
        for pair in self.entangled_pairs:
            a = pair['a']
            b = pair['b']

            # Draw connection with varying opacity based on distance
            dx = a.x - b.x
            dy = a.y - b.y
            distance = math.sqrt(dx*dx + dy*dy)
            opacity = max(0, 0.3 * (1 - distance/600))

            painter.setPen(QPen(QColor(230, 126, 34, int(255 * opacity * pair['strength'])), 0.4))
            painter.drawLine(QPointF(a.x, a.y), QPointF(b.x, b.y))

        # Draw proximity connections
        for particle in self.particles:
            for target in particle.connections:
                dx = particle.x - target.x
                dy = particle.y - target.y
                distance = math.sqrt(dx*dx + dy*dy)
                opacity = 0.1 * (1 - distance/self.settings.interaction_distance)

                painter.setPen(QPen(QColor(241, 196, 15, int(255 * opacity)), 0.5))
                painter.drawLine(QPointF(particle.x, particle.y), QPointF(target.x, target.y))

                # Draw connection to divine center in meditation mode
                if self.meditation_mode:
                    dx = self.divine_center.x() - particle.x
                    dy = self.divine_center.y() - particle.y
                    distance = math.sqrt(dx*dx + dy*dy)
                    opacity = 0.05 * (1 - distance/400)

                    painter.setPen(QPen(QColor(157, 89, 182, int(255 * opacity)), 0.3))
                    painter.drawLine(QPointF(particle.x, particle.y), self.divine_center)

        # Draw particles
        for particle in self.particles:
            r, g, b = particle.color
            # Create radial gradient for particle
            gradient = QRadialGradient(
                QPointF(particle.x, particle.y),
                particle.size * 4,
                QPointF(particle.x, particle.y)
            )
            gradient.setColorAt(0, QColor(r, g, b))
            gradient.setColorAt(1, QColor(r, g, b, 50))

            painter.setBrush(QBrush(gradient))
            painter.setPen(Qt.NoPen)
            painter.drawEllipse(QPointF(particle.x, particle.y),
                              particle.size * 2,
                              particle.size * 2)

        # Draw stats
        painter.setPen(QColor(100, 223, 223))
        font = QFont("Arial", 10)
        painter.setFont(font)
        stats = [
            f"FPS: {int(self.fps)}",
            f"Particles: {len(self.particles)}",
            f"Interactions: {self.interaction_count}",
            f"Entangled Pairs: {self.entangled_count}"
        ]
        for i, stat in enumerate(stats):
            painter.drawText(10, 20 + i * 20, stat)

        # Draw legend
        self.draw_legend(painter)

    def draw_legend(self, painter):
        legend_items = [
            ("Conscious Beings", QColor(52, 152, 219)),
            ("Living Organisms", QColor(233, 30, 99)),
            ("Natural Elements", QColor(46, 204, 113)),
            ("Quantum Entanglement", QColor(230, 126, 34)),
            ("Divine Connection", QColor(157, 89, 182))
        ]

        painter.setBrush(QColor(30, 30, 60, 200))
        painter.setPen(QColor(100, 223, 223, 150))

        # Convert to integers for drawing
        legend_x = int(self.width() - 220)
        legend_y = int(self.height() - 170)
        legend_rect = QRectF(legend_x, legend_y, 200, 160)
        painter.drawRoundedRect(legend_rect, 10, 10)

        font = QFont("Arial", 10)
        painter.setFont(font)
        painter.setPen(QColor(255, 255, 255))

        # Convert coordinates to integers
        painter.drawText(
            int(legend_rect.x() + 10),
            int(legend_rect.y() + 20),
            "Cosmic Entities"
        )

        for i, (name, color) in enumerate(legend_items):
            painter.setBrush(color)
            painter.setPen(Qt.NoPen)

            # Convert coordinates to integers
            painter.drawEllipse(
                int(legend_rect.x() + 15),
                int(legend_rect.y() + 35 + i * 25),
                12,
                12
            )

            painter.setPen(QColor(200, 200, 200))

            # Convert coordinates to integers
            painter.drawText(
                int(legend_rect.x() + 35),
                int(legend_rect.y() + 45 + i * 25),
                name
            )

    def resizeEvent(self, event):
        # Update divine center position
        self.divine_center = QPointF(self.width() / 2, self.height() / 2)

        # Update particles' canvas dimensions
        for particle in self.particles:
            particle.canvas_width = self.width()
            particle.canvas_height = self.height()

        # Recreate the spatial grid
        self.grid = SpatialGrid(self.width(), self.height())
        for particle in self.particles:
            self.grid.add_particle(particle)

        super().resizeEvent(event)

class Settings:
    __slots__ = ('particle_count', 'entanglement', 'divine_force',
                 'gravity', 'velocity', 'interaction_distance')

    def __init__(self):
        self.particle_count = 500  # Start with 500 particles
        self.entanglement = 15  # %
        self.divine_force = 0.6
        self.gravity = 0.2
        self.velocity = 1.5
        self.interaction_distance = 60

class QuantumUniverseApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.settings = Settings()
        self.setWindowTitle("Quantum Interconnectedness Visualization")
        self.setGeometry(100, 100, 1200, 800)

        # Set application icon
        try:
            # First try to load from current directory
            self.setWindowIcon(QIcon('app_icon.ico'))
        except:
            try:
                # If not found, try to load using absolute path
                base_path = os.path.dirname(os.path.abspath(__file__))
                icon_path = os.path.join(base_path, 'app_icon.ico')
                self.setWindowIcon(QIcon(icon_path))
            except:
                # Use a fallback if icon can't be loaded
                print("Could not load application icon")

        # Create central widget and layout
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        main_layout.setSpacing(10)

        # Create header
        header = QLabel("Quantum Interconnectedness Visualization")
        header_font = QFont("Arial", 24, QFont.Bold)
        header.setFont(header_font)
        header.setStyleSheet("color: #64dfdf;")
        header.setAlignment(Qt.AlignCenter)
        main_layout.addWidget(header)

        # Create quote
        quote = QLabel('"All things are connected like the blood that unites us. We do not weave the web of life, we are merely a strand in it. Whatever we do to the web, we do to ourselves." - Chief Seattle')
        quote.setStyleSheet("color: #a9def9; font-style: italic; font-size: 12pt;")
        quote.setAlignment(Qt.AlignCenter)
        quote.setWordWrap(True)
        main_layout.addWidget(quote)

        # Create visualization widget
        self.universe_widget = UniverseWidget(self.settings)
        main_layout.addWidget(self.universe_widget, 1)

        # Create controls
        controls_layout = QHBoxLayout()
        controls_layout.setSpacing(10)
        main_layout.addLayout(controls_layout)

        # Quantum Entities group
        quantum_group = QGroupBox("Quantum Entities")
        quantum_layout = QVBoxLayout()
        quantum_layout.setSpacing(5)

        # Particle count slider
        particle_layout = QHBoxLayout()
        particle_label = QLabel("Entity Count:")
        particle_layout.addWidget(particle_label)
        self.particle_count_label = QLabel("500")  # Start with 500
        particle_layout.addWidget(self.particle_count_label)

        self.particle_slider = QSlider(Qt.Horizontal)
        self.particle_slider.setRange(100, 50000)  # Minimum 100 particles
        self.particle_slider.setValue(500)  # Start with 500
        self.particle_slider.setSingleStep(100)
        self.particle_slider.valueChanged.connect(self.update_particle_count)
        quantum_layout.addLayout(particle_layout)
        quantum_layout.addWidget(self.particle_slider)

        # Entanglement slider
        entanglement_layout = QHBoxLayout()
        entanglement_label = QLabel("Entanglement:")
        entanglement_layout.addWidget(entanglement_label)
        self.entanglement_label = QLabel("15%")
        entanglement_layout.addWidget(self.entanglement_label)

        self.entanglement_slider = QSlider(Qt.Horizontal)
        self.entanglement_slider.setRange(1, 30)
        self.entanglement_slider.setValue(15)
        self.entanglement_slider.valueChanged.connect(self.update_entanglement)
        quantum_layout.addLayout(entanglement_layout)
        quantum_layout.addWidget(self.entanglement_slider)

        # Add particles button
        self.add_particles_btn = QPushButton("Add 500 Quantum Entities")
        self.add_particles_btn.clicked.connect(self.add_particles)
        quantum_layout.addWidget(self.add_particles_btn)

        quantum_group.setLayout(quantum_layout)
        controls_layout.addWidget(quantum_group)

        # Universal Forces group
        forces_group = QGroupBox("Universal Forces")
        forces_layout = QVBoxLayout()
        forces_layout.setSpacing(5)

        # Divine force slider
        divine_layout = QHBoxLayout()
        divine_label = QLabel("Divine Influence:")
        divine_layout.addWidget(divine_label)
        self.divine_label = QLabel("0.6")
        divine_layout.addWidget(self.divine_label)

        self.divine_slider = QSlider(Qt.Horizontal)
        self.divine_slider.setRange(0, 10)
        self.divine_slider.setValue(6)
        self.divine_slider.valueChanged.connect(self.update_divine_force)
        forces_layout.addLayout(divine_layout)
        forces_layout.addWidget(self.divine_slider)

        # Gravity slider
        gravity_layout = QHBoxLayout()
        gravity_label = QLabel("Gravity:")
        gravity_layout.addWidget(gravity_label)
        self.gravity_label = QLabel("0.2")
        gravity_layout.addWidget(self.gravity_label)

        self.gravity_slider = QSlider(Qt.Horizontal)
        self.gravity_slider.setRange(0, 20)
        self.gravity_slider.setValue(2)
        self.gravity_slider.valueChanged.connect(self.update_gravity)
        forces_layout.addLayout(gravity_layout)
        forces_layout.addWidget(self.gravity_slider)

        # Reset button
        self.reset_btn = QPushButton("Reset Universe")
        self.reset_btn.clicked.connect(self.reset_universe)
        forces_layout.addWidget(self.reset_btn)

        forces_group.setLayout(forces_layout)
        controls_layout.addWidget(forces_group)

        # Cosmic Behavior group
        behavior_group = QGroupBox("Cosmic Behavior")
        behavior_layout = QVBoxLayout()
        behavior_layout.setSpacing(5)

        # Velocity slider
        velocity_layout = QHBoxLayout()
        velocity_label = QLabel("Movement Speed:")
        velocity_layout.addWidget(velocity_label)
        self.velocity_label = QLabel("1.5")
        velocity_layout.addWidget(self.velocity_label)

        self.velocity_slider = QSlider(Qt.Horizontal)
        self.velocity_slider.setRange(1, 30)
        self.velocity_slider.setValue(15)
        self.velocity_slider.valueChanged.connect(self.update_velocity)
        behavior_layout.addLayout(velocity_layout)
        behavior_layout.addWidget(self.velocity_slider)

        # Interaction distance slider
        interaction_layout = QHBoxLayout()
        interaction_label = QLabel("Interaction Range:")
        interaction_layout.addWidget(interaction_label)
        self.interaction_label = QLabel("60px")
        interaction_layout.addWidget(self.interaction_label)

        self.interaction_slider = QSlider(Qt.Horizontal)
        self.interaction_slider.setRange(20, 150)
        self.interaction_slider.setValue(60)
        self.interaction_slider.valueChanged.connect(self.update_interaction)
        behavior_layout.addLayout(interaction_layout)
        behavior_layout.addWidget(self.interaction_slider)

        # Meditation button
        self.meditation_btn = QPushButton("Meditation Mode")
        self.meditation_btn.clicked.connect(self.toggle_meditation)
        behavior_layout.addWidget(self.meditation_btn)

        behavior_group.setLayout(behavior_layout)
        controls_layout.addWidget(behavior_group)

        # Footer
        footer = QLabel("Visualization of quantum interconnectedness and universal oneness | Based on quantum entanglement theory")
        footer.setStyleSheet("color: #a9def9; font-size: 10pt;")
        footer.setAlignment(Qt.AlignCenter)
        main_layout.addWidget(footer)

    def update_particle_count(self, value):
        self.settings.particle_count = value
        self.particle_count_label.setText(f"{value}")
        self.reset_universe()

    def update_entanglement(self, value):
        self.settings.entanglement = value
        self.entanglement_label.setText(f"{value}%")
        self.universe_widget.create_entangled_pairs(value / 100.0)

    def update_divine_force(self, value):
        self.settings.divine_force = value / 10.0
        self.divine_label.setText(f"{self.settings.divine_force:.1f}")

    def update_gravity(self, value):
        self.settings.gravity = value / 100.0
        self.gravity_label.setText(f"{self.settings.gravity:.2f}")

    def update_velocity(self, value):
        self.settings.velocity = value / 10.0
        self.velocity_label.setText(f"{self.settings.velocity:.1f}")

    def update_interaction(self, value):
        self.settings.interaction_distance = value
        self.interaction_label.setText(f"{value}px")

    def add_particles(self):
        self.universe_widget.add_particles(500)
        self.settings.particle_count = len(self.universe_widget.particles)
        self.particle_count_label.setText(f"{self.settings.particle_count}")
        self.particle_slider.setValue(self.settings.particle_count)

    def reset_universe(self):
        self.universe_widget.reset_universe(self.settings.particle_count)

    def toggle_meditation(self):
        self.universe_widget.meditation_mode = not self.universe_widget.meditation_mode
        if self.universe_widget.meditation_mode:
            self.meditation_btn.setText("Normal Mode")
        else:
            self.meditation_btn.setText("Meditation Mode")

if __name__ == "__main__":
    app = QApplication(sys.argv)

    # Set dark theme
    app.setStyle("Fusion")
    dark_palette = app.palette()
    dark_palette.setColor(dark_palette.Window, QColor(12, 0, 50))
    dark_palette.setColor(dark_palette.WindowText, Qt.white)
    dark_palette.setColor(dark_palette.Base, QColor(25, 25, 50))
    dark_palette.setColor(dark_palette.AlternateBase, QColor(35, 35, 70))
    dark_palette.setColor(dark_palette.ToolTipBase, Qt.white)
    dark_palette.setColor(dark_palette.ToolTipText, Qt.white)
    dark_palette.setColor(dark_palette.Text, Qt.white)
    dark_palette.setColor(dark_palette.Button, QColor(58, 12, 163))
    dark_palette.setColor(dark_palette.ButtonText, Qt.white)
    dark_palette.setColor(dark_palette.BrightText, Qt.red)
    dark_palette.setColor(dark_palette.Highlight, QColor(100, 223, 223))
    dark_palette.setColor(dark_palette.HighlightedText, Qt.black)
    app.setPalette(dark_palette)

    window = QuantumUniverseApp()
    window.show()
    sys.exit(app.exec_())
