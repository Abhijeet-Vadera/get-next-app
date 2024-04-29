#!/usr/bin/env node
const { execSync } = require('child_process');
const { program } = require('commander');
const path = require('path');
const fs = require('fs-extra');
const cliProgress = require('cli-progress');

program
  .version('1.0.0')
  .arguments('<project-name>')
  .option('--translation', 'Add translation support')
  .action((projectName, options) => {
    const { translation } = options;

    const baseRepoUrl = 'git@github.com:team-scaletech/nextjs-base-x.git';
    const branchName = translation ? 'feature/translation' : 'main'; // Default branch

    const baseCommand = `git clone -b ${branchName} ${baseRepoUrl} ${projectName}`;

    // Create a new progress bar instance
    const progressBar = new cliProgress.SingleBar({
      format: 'Creating project [{bar}] {percentage}%',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
      stopOnComplete: true,
      clearOnComplete: false,
      fps: 10,
    });

    const executeCommand = (command, delay) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            execSync(command, { stdio: 'ignore' });
            resolve();
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    };

    const runCloningProcess = async () => {
      try {
        console.log(
          '\n===================================================================\n'
        );
        progressBar.start(3, 0);

        progressBar.update(1);

        await executeCommand(baseCommand, 1000); // Simulate cloning delay

        await executeCommand(
          `cd ${projectName} && git remote remove origin`,
          500
        ); // Simulate Git command delay

        progressBar.update(2);
        await executeCommand(`cd ${projectName} && rm -rf .git`, 500); // Simulate Git command delay

        progressBar.update(3);

        console.log(
          '\n===================================================================\n'
        );

        console.log('Base boilerplate created successfully.');

        console.log(
          '\n==================================================================='
        );
      } catch (error) {
        console.error('Error cloning base boilerplate:', error);
        process.exit(1);
      } finally {
        progressBar.stop();
      }
    };

    runCloningProcess();
  });

program.parse(process.argv);
