# (Temporary) Deployment HOWTO

In order to deploy to our temporary VM setup, you will need to invoke the `deploy_branch` script from a shell that has an SSH agent enabled. Check out the [relevant GitHub documentation](https://docs.github.com/en/developers/overview/using-ssh-agent-forwarding#your-local-ssh-agent-must-be-running) for some pointers. On Windows, the easiest way is to use [a git for Windows](https://gitforwindows.org/) bash shell and set up an SSH agent on it by following the GitHub guide.

If you are ready to deploy a branch to the server, first make sure the branch has been pushed to the GitHub remote (`Vibemap/vibemap-app`). Then you can deploy that branch by running `./deploy_branch.sh <branch_name>` from your SSH-agent enabled shell.
