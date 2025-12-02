import { NextResponse } from "next/server";
import { connectToDatabase, NodeData } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const nodes = await db
      .collection("nodes")
      .find({})
      .sort({ last_updated: -1 })
      .toArray();

    // Transform MongoDB documents to our NodeData format
    const transformedNodes: NodeData[] = nodes.map((node) => ({
      _id: node._id.toString(),
      node_id: node.node_id,
      latitude: node.latitude,
      longitude: node.longitude,
      current_level: node.current_level,
      is_dead: node.is_dead,
      last_updated: node.last_updated,
      created_at: node.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: transformedNodes,
      count: transformedNodes.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching nodes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch nodes data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

