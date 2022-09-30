---
sidebar_position: 3
---

# Getting a text editor

Whatever you do, you're going to want a good text editor.  There are many choices -

* On **Mac OS X**, try [Visual Studio Code](https://code.visualstudio.com)choose [TextMate](https://www.textmate.org), or [Sublime Text](https://www.sublimetext.com), .
* On **Linux**, try [Visual Studio Code](https://code.visualstudio.com) or [Sublime Text](https://www.sublimetext.com).
* On **Windows**, [Visual Studio Code](https://code.visualstudio.com) is a good choice.

You also get other text editors around - for if you edit a text or markdown file inside
[Jupyter Lab](Jupyterlab.md), that's a text editor, similarly [Rstudio](R.md) has its own editor.


## Installing Visual Studio Code

If you are on Windows in particular you will almost certainly want Visual Studio Code installed, in
particular because it is set up to work well with your [Windows Subsystem for Linux](UNIX.md) system.  It works like this:

1. visit the (Visual Studio Code website)[https://code.visualstudio.com], download and install it.
2. Start Visual Studio Code and enter the extensions manager (one of the icons on the left).
3. Search for 'WSL' and click on the 'WSL' extension and install it.

At this point something neat happens: you'll see an extra icon called 'Remote Explorer' appear in
the icon tray on the left. Click it and you'll see a folder called 'Ubuntu' with your home folder
inside. **This is now pointing at your UNIX home folder**, and it gives you a seamless way to edit
files that work with your UNIX command-line.

Going the other way is also easy: start your UNIX terminal and find a file or fodler you'd like to edit.
For example we could make one like this
```
echo 'This is a test file' > test.txt
```

You can now edit the file in VS Code like so:
```
code ./text.txt
```

VS Code should magically appear and open your file.

:::tip

You can also 'open' a whole folder:
```
code ./
```

which is usually nicer, as it gives you a file explorer on the left where you can pick what you want to edit.
:::

### Running a terminal in VS Code

It's also possible to get your UNIX terminal directly in VS Code. From the window above, go to the
`Terminal` menu and choose 'New Terminal'.  The window that opens is a UNIX terminal pointing at the same folder as your file.



