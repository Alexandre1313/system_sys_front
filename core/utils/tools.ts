const ip = "192.168.1.22";
const port = "4997";

function convertSPTime(dateString: string): string {
    const date = new Date(dateString);  
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };  
    const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(date);
    return formattedDate;
}

function concat(s: string): string {
  // Remove espaços em branco e normaliza a string para remover acentos
  return s
    .replace(/\s+/g, '')               // Remove todos os espaços em branco
    .normalize('NFD')                  // Normaliza a string para separar acentos
    .replace(/[\u0300-\u036f]/g, '');  // Remove os diacríticos (acentos)
}

export { ip, port, convertSPTime, concat}
