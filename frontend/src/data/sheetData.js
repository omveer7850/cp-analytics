
import { blind75 } from './sheets/blind75';
import { neetcode150 } from './sheets/neetcode150';
import { grind169 } from './sheets/grind169';
import { striverA2Z } from './sheets/striverA2Z';

export const sheetData = {
  'blind75': {
    sheetName: "Blind 75",
    chunks: [{ problems: blind75 }]
  },
  'neetcode150': {
    sheetName: "NeetCode 150",
    chunks: [{ problems: neetcode150 }]
  },
  'grind169': {
    sheetName: "Grind 169",
    chunks: [{ problems: grind169 }]
  },
  'striverA2Z': {
    sheetName: "Striver's A2Z Sheet",
    chunks: [{ problems: striverA2Z }]
  }
};