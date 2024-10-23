export const processarCodigoDeBarras = (
    value: string,
    formData: any,
    setFormData: (data: any) => void,
    setModalMessage: (message: string) => void,
    setModalOpen: (open: boolean) => void
) => {
    // Verifica se o valor contém apenas números (0-9)
    const isNumeric = /^[0-9]*$/.test(value);

    // Se o valor não for numérico, mantém o campo com o valor digitado
    if (!isNumeric) {
        // Não alterar o estado para limpar o campo
        return; // Sai da função, nada mais é executado
    }

    const itemCodigo = formData.ITEM_SELECIONADO?.itemTamanho?.barcode?.codigo;
    const quantidade = formData.ITEM_SELECIONADO?.quantidade;

    // Atualiza o CODDEBARRASLEITURA com o valor digitado
    setFormData((prevData: any) => ({
        ...prevData,
        CODDEBARRASLEITURA: value, // Sempre atualiza para o valor digitado
    }));

    if (value.length === 3) {
        if (value === itemCodigo) {
            // Verifica se a quantidade lida não ultrapassa a quantidade permitida
            if (Number(formData.QUANTIDADELIDA) < quantidade) {
                setFormData((prevData: any) => ({
                    ...prevData,
                    QUANTIDADELIDA: String(Number(prevData.QUANTIDADELIDA) + 1), // Incrementa QUANTIDADELIDA
                    CODDEBARRASLEITURA: '',
                    // Não limpa o campo aqui
                }));
            } else {
                // Se a quantidade exceder, exibe a mensagem no modal
                setModalMessage('Quantidade excedida');
                setModalOpen(true);
                setFormData((prevData: any) => ({
                    ...prevData,                  
                    CODDEBARRASLEITURA: '',
                    // Não limpa o campo aqui
                }));
            }
        } else {
            // Se o código não corresponder, podemos exibir uma mensagem no modal
            setModalMessage('Código de barras inválido');
            setModalOpen(true);
            // Não limpamos o campo aqui, para que o usuário veja o que digitou
        }
    }
};
