import os
import sys
import winreg
import ctypes
import sys

def create_desktop_shortcut():
    # Get paths
    desktop_path = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
    script_dir = os.path.dirname(os.path.abspath(__file__))
    exe_path = os.path.join(script_dir, 'dist', 'run_quantum_universe.exe')
    icon_path = os.path.join(script_dir, 'app_icon.ico')

    # Create shortcut path
    shortcut_path = os.path.join(desktop_path, 'Quantum Universe.lnk')

    # Create shortcut using Windows Script Host
    vbscript = f"""
    Set oWS = WScript.CreateObject("WScript.Shell")
    sLinkFile = "{shortcut_path}"
    Set oLink = oWS.CreateShortcut(sLinkFile)
    oLink.TargetPath = "{exe_path}"
    oLink.IconLocation = "{icon_path}, 0"
    oLink.WorkingDirectory = "{os.path.dirname(exe_path)}"
    oLink.Save
    """

    # Write VBS script to temporary file
    with open('create_shortcut.vbs', 'w') as f:
        f.write(vbscript)

    # Execute VBS script
    os.system('cscript create_shortcut.vbs')

    # Clean up
    os.remove('create_shortcut.vbs')

    print(f"Shortcut created at: {shortcut_path}")

if __name__ == "__main__":
    create_desktop_shortcut()
