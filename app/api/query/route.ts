import { NextRequest, NextResponse } from 'next/server';
import { QueryFeedsRequest, QueryFeedsResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: QueryFeedsRequest = await request.json();
    // 从环境变量读取后端配置
    const apiBaseUrl = process.env.API_BASE_URL;
    const authUser = process.env.API_BASIC_AUTH_USER;
    const authPass = process.env.API_BASIC_AUTH_PASS;

    if (!apiBaseUrl) {
      return NextResponse.json(
        { error: '服务器配置错误：缺少 API_BASE_URL' },
        { status: 500 }
      );
    }

    // 构建请求头
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    };

    // 如果配置了 Basic Auth，则添加认证头
    if (authUser && authPass) {
      const credentials = Buffer.from(`${authUser}:${authPass}`).toString('base64');
      headers['Authorization'] = `Basic ${credentials}`;
    }

    // 请求真实后端
    const response = await fetch(`${apiBaseUrl}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);
      return NextResponse.json(
        { error: '获取文章失败', details: errorText },
        { status: response.status }
      );
    }

    const data: QueryFeedsResponse = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Query feeds error:', error);
    return NextResponse.json(
      { error: '请求失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
