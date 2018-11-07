(function ($){
	$.fn.scale = function (contentSelector, initWidth = false) {
		if (!contentSelector) {
			console.error('未设置可缩放DOM选择器')

			return false
		}

		// 初始化内部可缩放物体
		const $content = this.find(contentSelector)
		// 初始化当前缩放倍数
		let originScale = 1

		if (!$content) {
			console.error('可缩放DOM选择器有误')

			return false
		}

		// 初始化容器宽高
		let containerWidth = this.width()
		let containerHeight = this.height()

		// 初始化缩放容器宽高
		let contentWidth = $content.width()
		let contentHeight = $content.height()

		// 初始化touch位置
		let touchPos = false
		// 初始化scale位置
		let scaleDis = false
		// 初始化scale
		let scale = 1

		// 初始化容器
		this.css({overflow: 'hidden', position: 'relative'})

		// 初始化缩放DOM相对位置
		const contentPos = $content.position()

		// 初始化缩放DOM
		$content.css({position: 'absolute', top: contentPos.top, left: contentPos.left})

		// 初始化宽度
		if (initWidth) {
			scale = containerWidth / contentWidth

			contentPos.top = (contentHeight * scale / 2) - (contentHeight / 2)
			contentPos.left = (containerWidth - contentWidth) / 2

			$content.css({ position  : 'absolute',
						   top       : contentPos.top,
						   left      : contentPos.left,
						   transform : `scale(${scale})` })
		}

		this.on('touchstart', touchStart)
		this.on('touchmove', touchMove)
		this.on('touchend', e => {
			touchPos = false

			scalePos = { one: false, two: false }
		})

		let moveType = false

		// 手指事件
		function touchStart ({ touches }) {
			if (touches.length === 1) {
				const [{pageX, pageY}] = touches

				moveType = 'move'

				touchPos = [pageX, pageY]
			}

			if (touches.length > 1) {
				const [{pageX: oneX, pageY: oneY}, {pageX: twoX, pageY: twoY}] = touches

				moveType = 'scale'

				scaleDis = getTwoPointsDistance([oneX, oneY], [twoX, twoY])
			}
		}

		function touchMove ({ touches }) {
			moveType === 'move' && handleMove(touches)
			moveType === 'scale' && handleScale(touches)
		}

		// 处理移动事件
		function handleMove ([{pageX, pageY}]) {
			const minusPos = [pageX - touchPos[0], pageY - touchPos[1]]

			contentPos.left += minusPos[0]
			contentPos.top += minusPos[1]

			$content.css({top: contentPos.top, left: contentPos.left})

			touchPos = [pageX, pageY]
		}

		// 处理缩放事件
		function handleScale ([{pageX: oneX, pageY: oneY}, {pageX: twoX, pageY: twoY}]) {
			const currentDis = getTwoPointsDistance([oneX, oneY], [twoX, twoY])

			const add = (currentDis - scaleDis) / scaleDis

			scale += add

			$content.css('transform', `scale(${scale})`)

			$('.debug').html(scale)

			if (scale < 0.6) $content.css('transform', `scale(${scale = 1})`)

			scaleDis = currentDis
		}

		function getTwoPointsDistance (pointOne, pointTwo) {
			const minusX = Math.abs(pointOne[0] - pointTwo[0])
			const minusY = Math.abs(pointOne[1] - pointTwo[1])

			return Math.sqrt((minusX * minusX) + (minusY + minusY))
		}

		return this
	}
})(jQuery);
