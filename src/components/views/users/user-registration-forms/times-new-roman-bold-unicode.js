﻿import { jsPDF } from 'jspdf';

const callAddFont = function () {
  this.addFileToVFS('Times New Roman-bold.ttf', font);
  this.addFont('Times New Roman-bold.ttf', 'Times New Roman', 'bold');
};
jsPDF.API.events.push(['addFonts', callAddFont]);