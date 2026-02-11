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

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const completed = searchParams.get("completed")

    // Build where clause for filtering
    const whereClause: any = {
      userId,
    }

    // Add word-based search filter  
    if (search && search.trim()) {
      const words = search.trim().split(/\s+/).filter(w => w.length > 0)
      if (words.length > 0) {
        // Match any word in title or description
        whereClause.OR = words.flatMap(word => [
          { title: { contains: word, mode: "insensitive" } },
          { description: { contains: word, mode: "insensitive" } },
        ])
      }
    }

    // Add completion filter
    if (completed !== null) {
      whereClause.completed = completed === "true"
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: { tags: true },
      orderBy: { dueDate: "asc" },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Fetch tasks error:", error)
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

    const { title, description, priority, dueDate, tagIds } = await req.json()

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    if (!dueDate) {
      return NextResponse.json(
        { error: "Due date is required" },
        { status: 400 }
      )
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
        tags: {
          connect: tagIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: { tags: true },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, title, description, priority, dueDate, completed, tagIds } =
      await req.json()

    if (!id) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 })
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed,
        tags: {
          set: tagIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: { tags: true },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 })
    }

    await prisma.task.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Task deleted" })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
