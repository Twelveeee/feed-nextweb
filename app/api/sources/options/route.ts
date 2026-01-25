import { NextRequest, NextResponse } from 'next/server';
import { SourcesOptionsResponse, ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // 从环境变量读取后端配置
    const apiBaseUrl = process.env.API_BASE_URL;
    const authUser = process.env.API_BASIC_AUTH_USER;
    const authPass = process.env.API_BASIC_AUTH_PASS;

    if (!apiBaseUrl) {
      return NextResponse.json({
        errno: 1002,
        errmsg: '服务器配置错误：缺少 API_BASE_URL',
        data: null
      });
    }

    // 构建请求头
    const headers: HeadersInit = {
      'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    };

    // 如果配置了 Basic Auth，则添加认证头
    if (authUser && authPass) {
      const credentials = Buffer.from(`${authUser}:${authPass}`).toString('base64');
      headers['Authorization'] = `Basic ${credentials}`;
    }

    // 请求真实后端
    const response = await fetch(`${apiBaseUrl}/api/sources/options`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);
      return NextResponse.json({
        errno: 1002,
        errmsg: '获取订阅源选项失败',
        data: null
      });
    }

    const result: ApiResponse<SourcesOptionsResponse> = await response.json();

    // 直接返回后端的响应（已经是统一格式）
    return NextResponse.json(result);

  } catch (error) {
    console.error('Get sources options error:', error);
    return NextResponse.json({
      errno: 1002,
      errmsg: '请求失败',
      data: null
    });
  }
}
