(function ($){
	$.fn.scale = function (contentSelector) {
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

		$content.on('touchstart', touchStart)
		$content.on('touchmove', touchMove)
		$content.on('touchend', e => {
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

			// 防止左侧越界
			contentPos.left <= (contentWidth / -2) && (contentPos.left = contentWidth / -2 + 50)
			// 防止右侧越界
			contentPos.left >= (containerWidth - (contentWidth / 2)) && (contentPos.left = containerWidth - (contentWidth / 2) - 50)
			// 防止顶部越界
			contentPos.top <= (contentHeight / -2) && (contentPos.top = contentHeight / -2 + 50)
			// 防止底部越界
			contentPos.top >= (containerHeight - (contentHeight / 2)) && (contentPos.top = containerHeight - (contentHeight / 2) - 50)

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
	}
})(jQuery);