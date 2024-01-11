---
category: 'iOS'
date: '2024-01-10'
title: 'UIViewController를 SwiftUI preview로 보여주기'
tags: ['iOS', 'UIKit', 'SwiftUI']
---

# 왜 작성하게 되었는가?

그동안 현업으로만 Swift를 써오면서 몰랐던 키워드를 공부해보기 위해 여러 강의를 보고 있습니다.  
그 중에 SwiftUI의 제일 큰 특징 중 하나인 preview를 UIKit으로 만든 UIViewController에서도 보여줄 수 있다는 걸 알게 되어 코드를 작성합니다.

```swift
// SwiftUI preview with UIKIt
@available(iOS 13.0.0, *)
struct ViewController_preview: PreviewProvider {

    static var previews: some View {
        Container()
    }

// macro with XCode 15(swift 5.9)
//    #Preview {
//        Container()
//    }

    struct Container: UIViewControllerRepresentable {

        func makeUIViewController(context: Context) -> UIViewController {
            let layout = UICollectionViewLayout()
            let vc = ViewController(collectionViewLayout: layout)
            return UINavigationController(rootViewController: vc)
        }

        func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}

        typealias UIViewControllerType = UIViewController
    }
}
```
