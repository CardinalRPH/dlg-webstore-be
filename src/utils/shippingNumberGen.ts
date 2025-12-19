const generateTrackShippingNumber = (courier: string, service: string): string => {
    const prefix = `${courier.substring(0, 3).toUpperCase()}-${service.substring(0, 3).toUpperCase()}`
    const currentDate = new Date()
    const dateString = `${currentDate.getFullYear().toString().slice(-2)}${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${currentDate.getDate().toString().padStart(2, "0")}`
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000)
    return `${prefix}-${dateString}-${randomNumber}`
}