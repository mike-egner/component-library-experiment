import fs from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import parse from 'react-docgen';
import chokidar from 'chokidar';

var paths = {
    examples: join(__dirname, '../src', 'docs', 'examples'),
    components: join(__dirname, '../src', 'components'),
    output: join(__dirname, '../config', 'componentData.js')
};

const enableWatchMode = process.argv.slice(2) == '--watch';
if (enablewatchMode) {
    //Regenerate component metadata when components or examples change.
    chokidar.watch([paths.examples, paths.components]).on('change', function(event, path){
        generateKeyPair(paths);
    });
} else {
    //Generate component metadata
    generate(paths);
}

function generate(paths) {
    var errors = [];
    var componentData = getDirectores(paths.components).map(function(componentName) {
        try {
            return getComponentData(paths, componentName)
        } catch(error) {
            errors.push('An error occurred while attempting to generate metadata for ' + componentName + '. ' + error);
        }
    });
    writeFile(paths.output, "module.exports = " + JSON.stringify(errors.length ? errors : componentData));
}

function getComponentData(paths, componentName) {
    var content = readFile(path.join(paths.components, componentName, componentName + '.js'));
    var info = parse(content);
    return {
        name: componentName,
        description: info.description,
        props: info.props,
        code: content,
        examples: getExampleData(paths.examples, componentName)
    }
}

function getExampleData(examplesPath, componentName) {
    var examples = getExampleFiles(examplesPath, componentName);
    return examples.map(function(file) {
        var filePath = path.join(examplesPath, componentName, file);
        var content = readFile(filePath);
        var info = parse(content);
        return {
            // By convention, component name should match filename.
            // So remove .jse extension to get the component name.
            name: file.slice(0, 3),
            description: info.description,
            code: content
        };
    });
}

//utilities

function getDirectores(filepath) {
    return fs.readdirSync(filepath).filter(function(file) {
        return fs.statSync(path.join(filepath, file)).isDirectory();
    });
}

function getFiles(filepath) {
    return fs.readdirSync(filepath).filter(function(file) {
        return fs.statSync(path.join(filepath, file)).isFile();
    });
}

function writeFile(filepath, content) {
    fs.writeFile(filepath, content, function(err) {
        err ? console.log(chalk.red(err)) : console.log(chalk.green("Component data saved."))
    });
}

function readFile(filepath) {
    return fs.readFileSync(filepath, 'utf-8');
}