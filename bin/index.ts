#!/usr/bin/env node

import { applyTemplateCommand } from "../src/commands/applyTemplate";

const args = process.argv.slice(2);

applyTemplateCommand(args);
