---
sidebar_position: 6
---

# Julia

Julia is an interesting language that is pretty good for many data analysis and computational
tasks. Like python it has a rich ecosystem of data analysis packages but it has a few features that
make it different from others

- like C++ it is strongly typed and compiled.  It's easier to avoid paying a performance cost than in python or R.
- Nevertheless it acts much like an interpreted language, like Python or R.
- It also has an interesting approach based on *multiple dispatch* (different, say, from object-oriented languages like python)

Installing julia is easy using conda:
```
mamba install -c conda-forge julia
```

Or by downloading directly from the [julia website](https://julialang.org). (**Note.** As before,
on Windows you will likely want to install into your UNIX terminal instead - using conda is
simplest for that.)

Once installed you can start it by typing `julia`:

```
$ julia

               _
   _       _ _(_)_     |  Documentation: https://docs.julialang.org
  (_)     | (_) (_)    |
   _ _   _| |_  __ _   |  Type "?" for help, "]?" for Pkg help.
  | | | | | | |/ _` |  |
  | | |_| | | | (_| |  |  Version 1.7.2 (2022-02-06)
 _/ |\__'_|_|_|\__'_|  |  Official https://julialang.org/ release
|__/                   |

julia> 
````

See the [Julia webpage](https://www.julialang.org) for more details.
