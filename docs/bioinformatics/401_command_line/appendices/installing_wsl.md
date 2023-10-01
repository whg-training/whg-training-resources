---
sidebar_position: 10
---

# Installing the Windows Subsystem for Linux

The UNIX terminal for Windows requires Windows 10 or above. The full installation instructions are available on-line,
but here's a brief guide.

You will need administrator permissions to install WSL. If you don't have those permissions, contact your IT team to
install it for you.

1. Start a Windows command prompt as an administrator. To do this, type 'command' into the start menu search box. But **don't** left-click on the '**Command Prompt**' app!
2. Instead, right-click and select 'run as administrator'.
3. You will be asked to allow the app to make changes to your device – click yes.
4. In the command prompt window, type: `wsl --install -d Ubuntu` and press Enter.
5. The first part of the installation will take a minute or two. During this time you'll see various messages about Windows downloading and installing various components.
6. When this process has finished, reboot your computer.
7. Once you log back in, the installation will continue - a window will open saying 'Installing: Ubuntu'. Don't panic! It's not removing Windows, just adding a version of Ubuntu embedded inside Windows.
8. Once installation is complete, you should have a new Ubuntu app in your start menu. The first time you click it, it will ask you to choose a new username and password. I suggest using the same username as you have on your computer, but in any case don't forget these!
9. If it doesn't seem to work, you might need to restart your PC one final time and try again.
