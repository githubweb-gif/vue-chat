export default {
  friends() {
    const list = [
      {
        id: 2,
        name: '大海1',
        imgurl: 'four1.jpg',
        tip: 6,
        time: Date.now(),
        news: '该属性可能取6个值，除了auto，其他都与align-items属性完全一致。'
      },
      {
        id: 3,
        name: '大海2',
        imgurl: 'four2.jpg',
        tip: 22,
        time: Date.now(),
        news:
          'flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。'
      },
      {
        id: 4,
        name: '大海3',
        imgurl: 'four3.jpg',
        tip: 999,
        time: Date.now(),
        news: '默认为0，即如果存在剩余空间，也不放大。'
      },
      {
        id: 5,
        name: '大海',
        imgurl: 'four.jpg',
        tip: 2,
        time: new Date('2017-1-1'),
        news: 'align-self属性允许单个项目有与其他项目不一样的对齐方式'
      },
      {
        id: 6,
        name: '大海1',
        imgurl: 'four1.jpg',
        tip: 6,
        time: Date.now(),
        news: '该属性可能取6个值，除了auto，其他都与align-items属性完全一致。'
      },
      {
        id: 7,
        name: '大海2',
        imgurl: 'four2.jpg',
        tip: 22,
        time: Date.now(),
        news:
          'flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。'
      },
      {
        id: 8,
        name: '大海8',
        imgurl: 'four3.jpg',
        tip: 999,
        time: Date.now(),
        news: '默认为0，即如果存在剩余空间，也不放大。'
      },
      {
        id: 9,
        name: '大海',
        imgurl: 'four.jpg',
        tip: 2,
        time: new Date('2017-1-1'),
        news: 'align-self属性允许单个项目有与其他项目不一样的对齐方式'
      },
      {
        id: 10,
        name: '大海1',
        imgurl: 'four1.jpg',
        tip: 6,
        time: Date.now(),
        news: '该属性可能取6个值，除了auto，其他都与align-items属性完全一致。'
      },
      {
        id: 11,
        name: '大海2',
        imgurl: 'four2.jpg',
        tip: 22,
        time: Date.now(),
        news:
          'flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。'
      },
      {
        id: 12,
        name: '大海3',
        imgurl: 'four3.jpg',
        tip: 999,
        time: Date.now(),
        news: '默认为0，即如果存在剩余空间，也不放大。'
      }
    ]

    return list
  },
  isFriend: function() {
    const list = [
      {
        userid: 1,
        friend: 2
      },
      {
        userid: 1,
        friend: 6
      },
      {
        userid: 1,
        friend: 5
      },
      {
        userid: 1,
        friend: 8
      }
    ]
    return list
  }
}
