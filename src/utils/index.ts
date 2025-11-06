export const getMessagesValue = (body: any)=>{
    const change = body?.entry?.[0]?.changes?.[0];
    const { value } = change ?? {};
    return value;
};