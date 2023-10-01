---
sidebar_position: 8
---

# Some important facts about file names

It is worth remembering that:

* File names in Linux, just like command and option names, are case sensitive.  The names `File.txt` and `file.txt`
  refer to different files.

* File names beginning with a period (“.”) character are 'hidden', so if you type `ls` you won’t see them unless you
also use the option `-a`. Some applications usually place their configuration/settings files in your home directory as
hidden files (if you try `ls -a ~` you may see there are quite a lot of them.)

* Linux supports file names containing white spaces and punctuation characters, so you might be tempting to start
  writing `Long, Complicated Filename That Look Like This!!!`. However, these filenames are often hard to interact with
  in other commands later, so for bioinformatics work it is generally best to restrict to a few characters - letters,
  numbers, the period (“.”), dash (“-”), and underscore (“_”) are generally good - and to try to avoid using spaces. You
  will thank yourself later for this!

* You should probably avoid using bash command names as filenames: although possible, this might mess up your commands!

## Next steps

Next we will learn more about [working with files](07_working_with_files.md).

