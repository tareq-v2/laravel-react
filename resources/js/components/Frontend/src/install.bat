@echo off
echo Installing Quantum Universe application...
echo.

:: Install dependencies
pip install pyinstaller PyQt5

:: Create executable
pyinstaller --onefile --windowed --icon=app_icon.ico run_quantum_universe.py

:: Create desktop shortcut
python create_desktop_shortcut.py

echo.
echo Installation complete! A shortcut has been created on your desktop.
pause
