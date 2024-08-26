/**上传图片时,加水印的方法*/
export function drawTextWaterMark(file){
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(file) // file转base64
    reader.onload = e => {
      const canvas = document.createElement('canvas')
      const img = new Image()
      img.src = e.target.result
      img.onload = () => {
        //图片加载后再添加水印，否则可能报错
        let width = img.width
        let height = img.height
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d') // 绘制2d图形
        ctx.drawImage(img, 0, 0, width, height)
        var basePx = canvas.width
        //字体大小  照片添加水印
        var fontSize = basePx / 30 //水印文字尺寸
        ctx.shadowColor = 'rgba(0, 0, 0,1)'
        ctx.shadowOffsetX = 3 //水印文字阴影
        ctx.shadowOffsetY = 3
        ctx.shadowBlur = 5
        ctx.rotate((-10 * Math.PI) / 180) //水印文字倾斜
        ctx.font = fontSize + 'px 微软雅黑'
        ctx.fillStyle = 'rgba(255,255,255,0.6)' //水印透明度
        var watermark ='仅供'+'|'+'河北地信集团'+'|'+'员工信息登记使用'
        // sessionStorage.getItem('id') +
        // '|' +
        // sessionStorage.getItem('name') +
        // '|' +
        // sessionStorage.getItem('orgName') //水印文字内容
        var watermarkSplit = watermark.split('|')
        let w = 4 //横向绘制次数
        let h = 4 //纵向绘制次数'
        //水印的总绘制次数
        let num = Math.round(w * h)
        for (let i = 0; i < num; i++) {
          if (i < w) {
            ctx.fillText(
              watermarkSplit[0],
              (width / 3) * i,
              height / 2 - 2.7 * fontSize
            )
            ctx.fillText(
              watermarkSplit[1],
              (width / 3) * i,
              height / 2 - 1.5 * fontSize
            )
            ctx.fillText(
              watermarkSplit[2],
              (width / 3) * i,
              height / 2 - 0.5 * fontSize
            )
          } else if (i >= w && i < w * 2) {
            ctx.fillText(
              watermarkSplit[0],
              (width / 3) * (i - w),
              height - 2.7 * fontSize
            )
            ctx.fillText(
              watermarkSplit[1],
              (width / 3) * (i - w),
              height - 1.5 * fontSize
            )
            ctx.fillText(
              watermarkSplit[2],
              (width / 3) * (i - w),
              height - 0.5 * fontSize
            )
          } else if (i >= w * 2 && i < w * 3) {
            ctx.fillText(
              watermarkSplit[0],
              (width / 3) * (i - w * 2),
              height * 1.5 - 2.7 * fontSize
            )
            ctx.fillText(
              watermarkSplit[1],
              (width / 3) * (i - w * 2),
              height * 1.5 - 1.5 * fontSize
            )
            ctx.fillText(
              watermarkSplit[2],
              (width / 3) * (i - w * 2),
              height * 1.5 - 0.5 * fontSize
            )
          }
        }

        var dataBase64 = canvas.toDataURL(file.type) // 输出压缩后的base64
        // base64转file
        const arr = dataBase64.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        const files = new File(
          [new Blob([u8arr], { type: mime })],
          file.name,
          { type: file.type }
        )
        files.uid = file.uid
        resolve(files)
      }
    }
  })
}
