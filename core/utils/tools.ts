import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const ip = "192.168.1.169";
const port = "4997";

function convertSPTime(dateString: string): string {
  const timeZone = 'America/Sao_Paulo';
  let date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error('Invalid Date:', dateString);
    date = new Date();
  }
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, 'dd/MM/yyyy HH:mm:ss');
}

function concat(s: string): string {
  // Remove espaços em branco e normaliza a string para remover acentos
  return s.replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function convertMilharFormatKG(peso: number): string {
  return `${peso.toLocaleString('pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  })} Kg`
}

function convertMilharFormatCUB(cubagem: number): string {
  return `${cubagem.toLocaleString('pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  })} m³`
}

function convertMilharFormat(value: number): string {
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`
}

export { concat, convertSPTime, convertMilharFormatKG, convertMilharFormatCUB, convertMilharFormat, ip, port };
