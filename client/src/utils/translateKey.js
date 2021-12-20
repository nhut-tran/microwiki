export const dictionaryMedia = {
    media: 'Môi trường',
    name: 'Tên môi trường',
    description: 'Mô tả',
    typeByUse: 'Phân loại theo mục đích sử dụng',
    typeByPhysical: 'Phân loại theo trạng thái vật lý',
    //GamPerLitter: 'Khối lượng cân g/lít',
    differential: 'Môi trường phân biệt vi sinh vật',
    selective: 'Môi trường chọc lọc',

    [`selective-differential`]: 'Môi trường chọc lọc và phân biệt',
    selectivedifferential: 'Môi trường chọc lọc và phân biệt',
    solid: 'Rắn',
    liquid: 'Lỏng',
    basal: 'Môi trường cơ bản',
    useIn: 'Sử dụng trong phương pháp'

}
export const dictionaryMethod = {
    methods: 'Phương pháp',
    name: 'Tên phương pháp',
    longDuration: 'Thời gian có kết quả (dài nhất)',
    shortDuration: 'Thời gian có kết quả (ngắn nhất)',
    negativeControlStrain: 'Chủng âm',
    positiveControlStrain: 'Chủng dương',
    topReadingInterval: 'Khoảng đọc trên',
    bottomReadingInterval: 'Khoảng đọc dưới',
    type: 'Phân loại',
    Quantity: 'Định lượng',
    Quanlity: 'Định tính',
    mediaName: 'Tên môi trường',
    mediaQuantity: 'Lượng môi trường',
    mediaUnit: 'Đơn vị tính',
    time: 'Thời gian ủ',
    temp: 'Nhiệt độ ủ'

}

const dataDictionary = {
    data: 'Dữ liệu đã lưu'
}
const keyTranslate = (filter, key) => {
    if (filter === 'media') {

        // if (key.includes(' ') && orginalKey !== 'name') {
        //     key = key.split('-').join('')
        // }
        return dictionaryMedia[key] ? dictionaryMedia[key] : key
    }
    if (filter === 'methods') {
        if (key.includes('step')) {
            key = key.replace('step', 'Quy trình')
        }

        return dictionaryMethod[key] ? dictionaryMethod[key] : key
    }
    if (filter === 'data') {
        return dataDictionary[key] ? dataDictionary[key] : key
    }

}

export default keyTranslate