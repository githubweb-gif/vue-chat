export default {
  message() {
    const list = [
      {
        uid: 'user',
        id: 1,
        avatar: 'http://localhost:3000/img/upload_64e66ac6ccc28bbfb49c33d70b3cd9a4.png',
        message: 'https://tse2-mm.cn.bing.net/th/id/OIP.IBGqSSUNzKh8u9_H9Th2MgHaLG?w=172&h=258&c=7&o=5&dpr=1.25&pid=1.7',
        imgurl: 'https://tse2-mm.cn.bing.net/th/id/OIP.IBGqSSUNzKh8u9_H9Th2MgHaLG?w=172&h=258&c=7&o=5&dpr=1.25&pid=1.7',
        tip: 6,
        types: 1,
        time: Date.now() - 1000 * 60 * 60 * 24 * 365,
        news: '该属性可能取6个值，除了auto，其他都与align-items属性完全一致。'
      },
      {
        uid: 'oneself',
        id: 2,
        avatar: 'http://localhost:3000//img/upload_87c3fdea906201a308782908481f4e73.png',
        message: 'http://localhost:3000//img/upload_64e66ac6ccc28bbfb49c33d70b3cd9a4.png',
        imgurl: 'http://localhost:3000//img/upload_64e66ac6ccc28bbfb49c33d70b3cd9a4.png',
        tip: 6,
        types: 1,
        time: Date.now() - 1000 * 60 * 60 * 24,
        news: '该属性可能取6个值，除了auto，其他都与align-items属性完全一致。'
      },
      {
        uid: 'user',
        id: 3,
        avatar: 'http://localhost:3000/img/upload_64e66ac6ccc28bbfb49c33d70b3cd9a4.png',
        message: '阿文阿大撒大苏打当地气温法国三国安抚爱国的示范啊打发发达是大多数啊',
        imgurl: 'http://localhost:3000//img/upload_87c3fdea906201a308782908481f4e73.png',
        tip: 6,
        types: 0,
        time: Date.now() + 1000 * 60 * 2,
        news: '该属性可能取6个值，除了auto，其他都与align-items属性完全一致。'
      },
      {
        uid: 'oneself',
        avatar: 'http://localhost:3000//img/upload_87c3fdea906201a308782908481f4e73.png',
        id: 4,
        message: '阿文阿大撒大苏打当地气温法国三国安抚爱国的示范啊打发发达是大多数啊',
        imgurl: 'https://tse1-mm.cn.bing.net/th/id/OIP.A62LEA8sxZN0FcCnWDFDIQHaFj?w=235&h=180&c=7&o=5&dpr=1.25&pid=1.7',
        tip: 6,
        types: 0,
        time: Date.now() + 1000 * 60 * 8,
        news: '该属性可能取6个值，除了auto，其他都与align-items属性完全一致。'
      },
      {
        uid: 'user',
        id: 5,
        avatar: 'http://localhost:3000/img/upload_64e66ac6ccc28bbfb49c33d70b3cd9a4.png',
        message: 'https://tse3-mm.cn.bing.net/th/id/OIP.RTbxIPoCpbenzfweQ1_dUQEsDI?w=288&h=192&c=7&o=5&dpr=1.25&pid=1.7',
        imgurl: 'https://tse3-mm.cn.bing.net/th/id/OIP.RTbxIPoCpbenzfweQ1_dUQEsDI?w=288&h=192&c=7&o=5&dpr=1.25&pid=1.7',
        tip: 6,
        types: 1,
        time: Date.now() + 1000 * 60 * 8,
        news: '该属性可能取6个值，除了auto，其他都与align-items属性完全一致。'
      }
    ]
    return list
  }
}
