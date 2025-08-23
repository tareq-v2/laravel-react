from quantum_universe import QuantumUniverseApp
import sys

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = QuantumUniverseApp()
    window.show()
    sys.exit(app.exec_())
