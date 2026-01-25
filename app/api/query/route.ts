import { NextRequest, NextResponse } from 'next/server';
import { QueryFeedsRequest, QueryFeedsResponse, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: QueryFeedsRequest = await request.json();

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
      'Content-Type': 'application/json',
      'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    };

    // 如果配置了 Basic Auth，则添加认证头
    if (authUser && authPass) {
      const credentials = Buffer.from(`${authUser}:${authPass}`).toString('base64');
      headers['Authorization'] = `Basic ${credentials}`;
    }

    // 请求真实后端
    const response = await fetch(`${apiBaseUrl}/api/feeds/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);
      return NextResponse.json({
        errno: 1002,
        errmsg: '获取文章失败',
        data: null
      });
    }

    const result: ApiResponse<QueryFeedsResponse> = await response.json();

    // 直接返回后端的响应（已经是统一格式）
    return NextResponse.json(result);

  } catch (error) {
    console.error('Query feeds error:', error);
    return NextResponse.json({
      errno: 1002,
      errmsg: '请求失败',
      data: null
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 构建查询参数对象
    const params: QueryFeedsRequest = {};

    if (searchParams.has('source_id')) {
      params.source_id = parseInt(searchParams.get('source_id')!);
    }
    if (searchParams.has('categories')) {
      params.categories = searchParams.getAll('categories');
    }
    if (searchParams.has('sources')) {
      params.sources = searchParams.getAll('sources');
    }
    if (searchParams.has('min_score')) {
      params.min_score = parseInt(searchParams.get('min_score')!);
    }
    if (searchParams.has('max_score')) {
      params.max_score = parseInt(searchParams.get('max_score')!);
    }
    if (searchParams.has('start_at')) {
      params.start_at = searchParams.get('start_at')!;
    }
    if (searchParams.has('end_at')) {
      params.end_at = searchParams.get('end_at')!;
    }
    if (searchParams.has('limit')) {
      params.limit = parseInt(searchParams.get('limit')!);
    }
    if (searchParams.has('cursor')) {
      params.cursor = searchParams.get('cursor')!;
    }

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

    // 构建 URL
    const url = new URL(`${apiBaseUrl}/api/feeds/query`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, String(v)));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });

    // 请求真实后端
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);
      return NextResponse.json({
        errno: 1002,
        errmsg: '获取文章失败',
        data: null
      });
    }

    const result: ApiResponse<QueryFeedsResponse> = await response.json();

    // 直接返回后端的响应（已经是统一格式）
    return NextResponse.json(result);

  } catch (error) {
    console.error('Query feeds error:', error);
    return NextResponse.json({
      errno: 1002,
      errmsg: '请求失败',
      data: null
    });
  }
}
