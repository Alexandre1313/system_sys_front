const ip = "192.168.1.22"

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

export { ip, convertSPTime}
