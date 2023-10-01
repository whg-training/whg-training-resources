# Getting started with snakemake

This is a quick snakemake example that uses `bwa mem` to align a few reads.
The dataset is tiny so you can safely run it e.g. on a laptop - very likely
also safe to run on the login nodes of your cluster.

## Basic alignment example

I'm assuming you have snakemake installed already.

To run the pipeline, do this: first, use the -n option to see what will be run:

```sh
snakemake -s align1.snakefile -n
```

If you look in align1.snakefile, you will see there are two rules.  The first one ("all")
is just a "here is what the main targets are" rule - it doesn't do anything but just tells
snakemake that it should try to figure out how to make the sam files.  Then snakemake realises
the "align" rule can make the sam files, so uses that to align the reads.

3. To properly run the pipeline, just in your session on the head node (i.e. without sending
to the cluster), run 

$ snakemake -s pipelines/alignment_test/align.snakefile --cores 1

With any luck it will run and output two sam files in results/alignment_test/

## Using a configuration file

4. This pipeline is a bit too simple - what if we want to add samples?  Or align to a different
reference?  Or something else?

A nice way to make it flexible is to collect  informatio about input data into a separate
configuration file.  I've set that up in a second snakemake file and config file.  Try it
like this:

```
\$ snakemake -s pipelines/alignment_test/align_with_cofig.snakefile --cores 1 --configfile pipelines/alignment_test/config.json
```

This should output two new sam files in the results folder, now named for the sample and
the assembly that is used to align to.  You can easily add new samples or assemblies by
editing the config file (or keep multiple config files for different parts of the analysis).

## Running it on the cluster
5. The above commands were run on the head node but For real work you have to submit jobs to
the cluster... this is a bit trickier.  You have to tell snakemake the qsub command line.
So you do something like:

```
$ snakemake -s pipelines/alignment_test/align.snakefile --cluster "qsub -q short.qc" --jobs 100 --jobname align.{jobid}
```

(When that gets annoying, you can collect your qsub command in another configuration file, as described here:
https://snakemake.readthedocs.io/en/stable/executing/cluster.html.  Or you can put this in a shell script.)

The above sends off all those jobs to the cluster and keeps track of them for you. You might
need to fiddle with the qsub command depending on how you are setup.  Once it's going you can run 

```
$ qstat
```
to see what you have running / waiting (hopefully all the jobs are called align.&lt;something&gt; because
of the --jobname argument above).

6. The only problem with submitting to the cluster is that the main snakemake process now sits and waits
for them all to finish.  That means you can't log off while the pipeline is running.
There are a couple of solutions to this - the one I use is by running it in GNU screen:

```
$ screen -S align snakemake -s align.snakefile --cluster "qsub -q short.qc" --jobs 100 --jobname align.{jobid}
```
Using screen is like running a new terminal window that just stays there even after you log out.
It is controlled with funny key combinations... to get out of the screen and back to your
original terminal, you have to press Ctrl-A D.  Now (back in the original terminal) do:

```
$ screen -list
```
This should show you a list of screens you have running (i.e. just one).  And

```
$ screen -r align
```

will take you back into it. (Ctrl-D or typing exit will properly quit the terminal).

The nice thing about this is that the screens stay running even if you log off... so you can run the pipeline
and come back to it the next day to see how it got on.

Alternative: there's a very similar (probably better) thing called tmux - see https://www.hamvocke.com/blog/a-quick-and-easy-guide-to-tmux/
I haven't used tmux but it seems to have a coloured thing so must be better.

## Other stuff
A further thing you can do is set up snakemake to use conda.
I'm not expert on this but David Flores is so you could ask him to help set it up.
The advantage is a. no need to hardcode paths to executables b. make sure and get the right executable version
and c. reproducibility.  Examples in the /well/longread/shared/illumina_vs_coolmps_paper/ folder.

Enjoy!
gb.

