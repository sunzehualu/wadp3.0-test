const path = require('path')
const fs = require('fs')

const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage,
} = require('./utils')
const pkg = require('./package.json')

const templateVersion = pkg.version

const { addTestAnswers } = require('./scenarios')

module.exports = {
  metalsmith: {
    // When running tests for the template, this adds answers for the selected scenario
    before: addTestAnswers
  },
  helpers: {
    if_or(v1, v2, options) {

      if (v1 || v2) {
        return options.fn(this)
      }

      return options.inverse(this)
    },
    template_version() {
      return templateVersion
    },
  },
  
  prompts: {
    name: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: 'Project name',
    },
    description: {
      when: 'isNotTest',
      type: 'string',
      required: false,
      message: 'Project description',
      default: '敏捷开发平台',
    },
    author: {
      when: 'isNotTest',
      type: 'string',
      message: 'Author',
    },
    HorizontalMenu: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Install HorizontalMenu?',
    }, 
    VerticalMenu: {
      when: 'isNotTest && !HorizontalMenu',
      type: 'confirm',
      message: 'Install VerticalMenu?',
    }, 
    Form: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Install Form?',
    }, 
    AutoTooltip: {
      when: 'isNotTest && !Form',
      type: 'confirm',
      message: 'Install AutoTooltip?',
    },
    InputNumberRange: {
      when: 'isNotTest && !Form',
      type: 'confirm',
      message: 'Install InputNumberRange?',
    }, 
    YearRangePicker: {
      when: 'isNotTest && !Form',
      type: 'confirm',
      message: 'Install YearRangePicker?',
    },
    IconSelect: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Install IconSelect?',
    }, 
    SelectTreeDialog: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Install SelectTreeDialog?',
    }, 
    SvgIcon: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Install SvgIcon?',
    }, 
    TablePanel: {
      when: 'isNotTest',
      type: 'confirm',
      message: 'Install TablePanel?',
    }, 
    ProcessBar: {
      when: 'isNotTest && !TablePanel',
      type: 'confirm',
      message: 'Install ProcessBar?',
    }, 
    autoInstall: {
      when: 'isNotTest',
      type: 'list',
      message:
        'Should we run `npm install` for you after the project has been created? (recommended)',
      choices: [
        {
          name: 'Yes, use NPM',
          value: 'npm',
          short: 'npm',
        },
        {
          name: 'No, I will handle that myself',
          value: false,
          short: 'no',
        },
      ],
    },
  },
  filters: {
    'src/components/Form/**/*': 'Form',
    'src/components/AutoTooltip/**/*': 'Form || AutoTooltip',
    'src/components/YearRangePicker/**/*': 'Form || YearRangePicker',
    'src/components/InputNumberRange/**/*': 'Form || InputNumberRange',
    'src/components/IconSelect/**/*': 'IconSelect',
    'src/components/SelectTreeDialog/**/*': 'SelectTreeDialog',
    'src/components/SvgIcon/**/*': 'SvgIcon',
    'src/components/TablePanel/**/*': 'TablePanel || ProcessBar',
    'src/views/menu/horizontal-menu/**/*': 'HorizontalMenu',
    'src/views/menu/vertical-menu/**/*': 'VerticalMenu'
  },
  complete: function(data, { chalk }) {
    const green = chalk.green

    sortDependencies(data, green)

    const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          return runLintFix(cwd, data, green)
        })
        .then(() => {
          printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      printMessage(data, chalk)
    }
  },
}
