---
sidebar_position: 10
---

# Environment variables

"Environment variables" are values that the system knows about and that you can access in your pipelines.
They are referred to using a dollar symbol (`$`) followed by the name of the variable - and are usually upper case.

For example this command:
```
% echo "Hello, $USER!"
```

works because `$USER` is the name of an environment variable, that is set to your user id.

:::tip Note
You can also wrap the name in curly braces `{}`, which helps if there's something immediately afterwards:
```
% echo "Hello-${USER}2023"
```
:::

Here is a table of commonly-used environment variables:

| Variable | What it is |
|---|---|
| `$USER` | Your user ID |
| `$HOME` | Your home directory |
| `$PATH` | A list of directories the command-line looks in to find programs |

If you want to see what's in any of these variables, use `echo` to print them:

```
% echo $HOME
```

::tip Note

The one place this doesn't work is inside single quotes (`''`).  Variables are **not** expanded in there.
Try the following to see this in action:
```
% echo $USER
% echo "$USER"
% echo '$USER'
```
:::
