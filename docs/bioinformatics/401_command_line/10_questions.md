---
sidebar_position: 11
---

# Challenge questions

Now test yourself on the tutorial!  Here are a few tasks to try out.

1. Change directory to your home directory and **create a new folder** named 'challenges'.  Then `cd` into it.

2. Use `echo` and [redirection](07_working_with_files.md#redirecting-output-to-a-file) to create a file called 'days_of_week.txt', listing the days
   of the week, one on each line.  After each day, write down whether it's a weekday or weekend.  Your file should look something like this:
```
Monday weekday
Tuesday weekday
(etc)
Saturday weekend
Sunday weekend
```

**Note**: remember you can use `↑` and `↓` to navigate back through your commands - this may make this much faster.

3. Use `less` or `cat` to view the contents of the file and check they are correct.  If not, use a [text editor](07_working_with_files.md#using-an-editor) to fix any problems.

4. Create a pipeline using `cat` and `grep` and `cut`, to print out just the *names* of the *weekdays*. **Note** If
   your file is space-separated, like the one above, you will need to use the `-f ' '` argument to `cut` to tell it to
   use spaces instead of `<tab>` characters.  Check the man page for `cut` more details.)

5. Add to your pipeline a command to sort the weekdays in alphabetical order.

6. Finally, add a `tr` command to your pipeline that changes 'a' to '@'.

:::tip Note
You should now should be looking at something like this:
```
Frid@y
Mond@y
Thursd@y
Tuesd@y
Wednesd@y
```
If so, well done!  If not, look carefully back at your previous commands (for example using
[`history`](appendices/navigating_history.md)) to see if you can spot what went wrong.
:::

Congratulations!  This is the end of the tutorial.


