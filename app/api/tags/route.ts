import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authConfig } from "@/lib/authConfig"

// Helper function to get user ID from request
async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  try {
    // Use getServerSession to properly validate the session
    const session = await getServerSession(authConfig)
    
    if (!session || !session.user) {
      console.log("No valid session found")
      return null
    }
    
    const userId = (session.user as any).id
    if (!userId) {
      console.log("No user ID in session")
      return null
    }
    
    return userId
  } catch (error) {
    console.error("Error getting user from session:", error)
    return null
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tags = await prisma.tag.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(tags)
  } catch (error) {
    console.error("Fetch tags error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, color } = await req.json()

    if (!name) {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      )
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        color: color || "#3B82F6",
        userId,
      },
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Tag already exists" },
        { status: 400 }
      )
    }
    console.error("Create tag error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

