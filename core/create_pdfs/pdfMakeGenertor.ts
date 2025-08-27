import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ExpedicaoResumoPDGrouped } from '../interfaces';

pdfMake.vfs = pdfFonts.vfs;

function formatDateTime(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function gerarPDFExpedicao(resumo: ExpedicaoResumoPDGrouped[]) {
  const now = new Date();
  const formattedDateTime = formatDateTime(now);

  const headers = [
    { text: 'Data', bold: true, fontSize: 9, margin: [0, 1, 0, 1] },
    { text: 'Item', bold: true, fontSize: 9, margin: [0, 1, 0, 1] },
    { text: 'Gênero', bold: true, fontSize: 9, margin: [0, 1, 0, 1] },
    { text: 'Tamanho', bold: true, fontSize: 9, margin: [0, 1, 0, 1] },
    { text: 'Previsto', bold: true, alignment: 'right', fontSize: 9, margin: [0, 1, 0, 1] },
    { text: 'Expedido', bold: true, alignment: 'right', fontSize: 9, margin: [0, 1, 0, 1] }
  ];

  const body: any[] = [];

  resumo.forEach(grupo => {
    // Linha com PROJETO e DATA E HORA DE GERAÇÃO
    body.push([
      {
        text: `PROJETO: ${grupo.projectname}`,
        colSpan: 3,
        bold: true,
        fontSize: 9,
        fillColor: '#dddddd',
        margin: [0, 2, 0, 2]
      },
      null,
      null,
      {
        text: `DATA E HORA DE GERAÇÃO: ${formattedDateTime}`,
        colSpan: 3,
        fontSize: 7,
        italics: true,
        alignment: 'right',
        fillColor: '#dddddd',
        margin: [0, 2, 0, 2]
      },
      null,
      null,
    ]);

    // Cabeçalho do grupo (colunas)
    body.push(headers);

    grupo.groupedItems.forEach(dataGroup => {
      dataGroup.items.forEach(item => {
        const isTotal = item.item === 'Total' || item.item === 'Total Geral';

        if (isTotal) {
          body.push([
            { text: '', margin: [0, 1, 0, 1] },
            {
              text: item.item,
              bold: true,
              fontSize: 9,
              fillColor: '#bbbbbb',
              margin: [0, 2, 0, 2]
            },
            { text: '', fillColor: '#bbbbbb' },
            { text: '', fillColor: '#bbbbbb' },
            {
              text: item.previsto.toString(),
              alignment: 'right',
              bold: true,
              fontSize: 9,
              fillColor: '#bbbbbb',
              margin: [0, 2, 0, 2]
            },
            {
              text: item.expedido.toString(),
              alignment: 'right',
              bold: true,
              fontSize: 9,
              fillColor: '#bbbbbb',
              margin: [0, 2, 0, 2]
            }
          ]);
        } else {
          body.push([
            { text: item.data || '', fontSize: 8, margin: [0, 1, 0, 1] },
            { text: item.item, fontSize: 8, margin: [0, 1, 0, 1] },
            { text: item.genero, fontSize: 8, margin: [0, 1, 0, 1] },
            { text: item.tamanho, fontSize: 8, margin: [0, 1, 0, 1] },
            {
              text: item.previsto.toString(),
              alignment: 'right',
              fontSize: 8,
              margin: [0, 1, 0, 1]
            },
            {
              text: item.expedido.toString(),
              alignment: 'right',
              fontSize: 8,
              margin: [0, 1, 0, 1]
            }
          ]);
        }
      });
    });
  });

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [15, 20, 15, 20],
    header: {
      margin: [15, 10, 15, 0],
      columns: [
        { text: 'RESUMO EXPEDIÇÃO POR DATA DE SAÍDA/PROJETO', style: 'header' },
        { text: formattedDateTime, alignment: 'right', fontSize: 9 }
      ]
    },
    footer: (currentPage: number, pageCount: number) => ({
      margin: [15, 0, 15, 10],
      columns: [
        { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center', fontSize: 8 }
      ]
    }),
    content: [
      {
        style: 'tableStyle',
        table: {
          headerRows: 2, // 2 linhas header para cada grupo (projeto+data e colunas)
          widths: ['auto', '*', '*', 'auto', 'auto', 'auto'],
          body
        },
        layout: {
          fillColor: (rowIndex: number) => {
            if (rowIndex % (body.length) === 0) return '#dddddd'; // fundo cinza projeto
            if (rowIndex % (body.length) === 1) return '#eeeeee'; // fundo cinza claro colunas
            return null;
          },
          hLineWidth: () => 0.8,
          vLineWidth: () => 0.8,
          hLineColor: () => '#aaa',
          vLineColor: () => '#aaa',
          paddingLeft: () => 4,
          paddingRight: () => 4,
          paddingTop: () => 1,
          paddingBottom: () => 1,
        }
      }
    ],
    styles: {
      header: {
        fontSize: 12,
        bold: true
      },
      tableStyle: {
        margin: [0, 5, 0, 15]
      }
    },
    defaultStyle: {
      fontSize: 8,
      lineHeight: 1.1
    }
  };

  pdfMake.createPdf(docDefinition).open();
}
