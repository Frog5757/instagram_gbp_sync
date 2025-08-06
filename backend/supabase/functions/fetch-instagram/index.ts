// supabase/functions/fetch-instagram-posts/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    // Supabaseクライアントを初期化
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 環境変数から必要な情報を取得
    const facebookAccessToken = Deno.env.get('FACEBOOK_ACCESS_TOKEN') // 長期トークン
    const instagramAccountId = Deno.env.get('INSTAGRAM_ACCOUNT_ID') // Instagram Business Account ID
    
    if (!facebookAccessToken || !instagramAccountId) {
      throw new Error('Required environment variables not found')
    }

    console.log('Fetching Instagram posts...')

    // Instagram Graph API（ビジネス用）から投稿を取得
    const instagramResponse = await fetch(
      `https://graph.facebook.com/v19.0/${instagramAccountId}/media?fields=id,media_url,caption,timestamp,media_type,permalink,thumbnail_url&limit=25&access_token=${facebookAccessToken}`
    )

    if (!instagramResponse.ok) {
      const errorData = await instagramResponse.json()
      throw new Error(`Instagram API error: ${errorData.error?.message || instagramResponse.status}`)
    }

    const instagramData = await instagramResponse.json()
    console.log(`Found ${instagramData.data?.length || 0} posts`)

    let newPosts = 0
    let updatedPosts = 0
    let skippedPosts = 0
    let errors = 0

    // 既存の投稿IDを一括で取得（効率化）
    const postIds = instagramData.data?.map((post: any) => post.id) || []
    const { data: existingPosts } = await supabase
      .from('instagram_posts')
      .select('instagram_id, is_synced')
      .in('instagram_id', postIds)

    const existingMap = new Map(
      existingPosts?.map(p => [p.instagram_id, p.is_synced]) || []
    )

    // 各投稿を処理
    for (const post of instagramData.data || []) {
      try {
        const exists = existingMap.has(post.id)
        
        if (exists) {
          // 既存の投稿の場合、キャプションなどが更新されている可能性があるので更新
          const { error: updateError } = await supabase
            .from('instagram_posts')
            .update({
              media_url: post.media_url || null,
              caption: post.caption || null,
              timestamp: post.timestamp ? new Date(post.timestamp).toISOString() : null,
              media_type: post.media_type || null,
              permalink: post.permalink || null,
              updated_at: new Date().toISOString()
            })
            .eq('instagram_id', post.id)

          if (updateError) {
            console.error(`Error updating post ${post.id}:`, updateError)
            errors++
          } else {
            console.log(`Updated existing post ${post.id}`)
            updatedPosts++
          }
        } else {
          // 新しい投稿を挿入
          const { error: insertError } = await supabase
            .from('instagram_posts')
            .insert({
              instagram_id: post.id,
              media_url: post.media_url || null,
              caption: post.caption || null,
              timestamp: post.timestamp ? new Date(post.timestamp).toISOString() : null,
              media_type: post.media_type || null,
              permalink: post.permalink || null,
              is_synced: false
            })

          if (insertError) {
            console.error(`Error inserting post ${post.id}:`, insertError)
            errors++
          } else {
            console.log(`Successfully saved new post ${post.id}`)
            newPosts++
          }
        }
      } catch (error) {
        console.error(`Error processing post ${post.id}:`, error)
        errors++
      }
    }

    const result = {
      success: true,
      message: 'Instagram posts fetched and processed',
      stats: {
        total_posts_found: instagramData.data?.length || 0,
        new_posts_saved: newPosts,
        posts_updated: updatedPosts,
        errors: errors
      },
      timestamp: new Date().toISOString()
    }

    console.log('Function completed:', result)

    return new Response(
      JSON.stringify(result),
      { 
        headers: { "Content-Type": "application/json" },
        status: 200
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    )
  }
})