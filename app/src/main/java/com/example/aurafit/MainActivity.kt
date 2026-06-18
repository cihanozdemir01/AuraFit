package com.example.aurafit

import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.webkit.WebViewAssetLoader
import com.example.aurafit.theme.AuraFitTheme

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    enableEdgeToEdge()
    setContent {
      AuraFitTheme {
        Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
          AndroidView(
            factory = { context ->
              val assetLoader = WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(context))
                .build()

              WebView(context).apply {
                webViewClient = object : WebViewClient() {
                  override fun shouldInterceptRequest(
                    view: WebView,
                    request: WebResourceRequest
                  ): WebResourceResponse? {
                    return assetLoader.shouldInterceptRequest(request.url)
                  }
                }
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                settings.allowFileAccess = true
                settings.allowContentAccess = true
                loadUrl("https://appassets.androidplatform.net/assets/index.html")
              }
            },
            modifier = Modifier.fillMaxSize().safeDrawingPadding()
          )
        }
      }
    }
  }
}
