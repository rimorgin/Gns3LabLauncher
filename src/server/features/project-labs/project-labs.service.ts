import { Lab as ILab } from "@srvr/types/lab.type.ts";
import { Lab, Prisma } from "@prisma/client";
import prisma from "@srvr/utils/db/prisma.ts";

export type ILabCreate = Omit<ILab, "id">;

export class LabService {
  static async createLab(
    data: ILabCreate & { projectId?: string },
  ): Promise<Partial<ILab>> {
    const lab = await prisma.lab.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        estimatedTime: data.estimatedTime,
        tags: data.tags,
        objectives: data.objectives,
        prerequisites: data.prerequisites,
        ...(data.projectId && { project: { connect: { id: data.projectId } } }),
        ...(data.createdBy && {
          createdBy: data.createdBy,
        }),
        environment: {
          create: {
            type: data?.environment?.type,
            startupConfig: null,

            topology: {
              create: {
                layout: data.environment.topology.layout,
                nodes: {
                  create: data.environment.topology.nodes.map((n) => ({
                    id: n.id,
                    name: n.name,
                    type: n.type,
                    x: n.x,
                    y: n.y,
                    icon: n.icon,
                    status: n.status,
                    credentials: n.credentials,
                    interfaces: {
                      create: n.interfaces.map((i) => ({
                        name: i.name,
                        ipAddress: i.ipAddress,
                        subnet: i.subnet,
                        enabled: i.enabled,
                        status: i.status,
                      })),
                    },
                  })),
                },
                links: {
                  create: data.environment.topology.links.map((l) => ({
                    id: l.id,
                    source: l.source,
                    target: l.target,
                    sourcePort: l.sourcePort,
                    targetPort: l.targetPort,
                    status: l.status,
                  })),
                },
                notes: {
                  create: (data.environment.topology?.notes ?? []).map((n) => ({
                    id: n.id,
                    text: n.text,
                    x: n.x,
                    y: n.y,
                    width: n.width,
                    height: n.height,
                  })),
                },
              },
            },
          },
        },

        guide: {
          create: {
            currentSection: Number(data.guide.currentSection),
            sections: {
              create: data?.guide?.sections?.map((s) => ({
                title: s.title,
                type: s.type,
                order: s.order,
                estimatedTime: s.estimatedTime,
                content: {
                  create: s.content.map((c) => ({
                    id: c.id,
                    type: c.type,
                    content: c.content,
                    metadata: {
                      create: {
                        ...(c.metadata?.language && {
                          language: c.metadata.language,
                        }),
                        ...(c.metadata?.device && {
                          device: c.metadata.device,
                        }),
                        ...(c.metadata?.command && {
                          command: c.metadata.command,
                        }),
                        ...(c.metadata?.expected_output && {
                          expected_output: c.metadata.expected_output,
                        }),
                        callout_type: c.metadata?.callout_type ?? "info",
                      },
                    },
                  })),
                },
                tasks: {
                  create: s.tasks.map((t) => ({
                    id: t.id,
                    description: t.description,
                    device: t.device,
                    commands: t.commands,
                    expectedResult: t.expectedResult,
                    isCompleted: t.isCompleted,
                    hints: t.hints,
                  })),
                },
                verifications: {
                  create: s.verifications.map((v) => ({
                    id: v.id,
                    description: v.description,
                    commands: v.commands,
                    expectedOutput: v.expectedOutput,
                    requiresScreenshot: v.requiresScreenshot,
                    device: v.device,
                    isCompleted: v.isCompleted,
                  })),
                },
                hints: s.hints,
              })),
            },
          },
        },

        resources: {
          create: data.resources.map((r) => ({
            id: r.id,
            title: r.title,
            type: r.type,
            url: r.url,
            description: r.description,
          })),
        },
        settings: {
          create: {
            maxAttemptSubmission: data.settings.maxAttemptSubmission,
            visible: data.settings.visible,
            disableInteractiveLab: data.settings.disableInteractiveLab,
            noLateSubmission: data.settings.noLateSubmission,
            onForceExitUponTimeout: data.settings.onForceExitUponTimeout,
          },
        },
      },
      omit: { createdBy: true },
    });

    return lab;
  }

  static async getLabById(id: string): Promise<Lab | null> {
    return prisma.lab.findUnique({
      where: { id },
      include: {
        environment: {
          include: {
            topology: {
              include: {
                links: true,
                nodes: { include: { interfaces: true } },
                notes: true,
              },
            },
          },
        },
        guide: {
          include: {
            sections: {
              include: {
                content: {
                  include: {
                    metadata: true,
                  },
                },
                tasks: true,
                verifications: true,
              },
            },
          },
        },
        resources: true,
        settings: true,
      },
    });
  }

  static async getAllLabs(): Promise<Lab[]> {
    return prisma.lab.findMany({
      include: {
        environment: {
          include: {
            topology: {
              include: {
                links: true,
                nodes: { include: { interfaces: true } },
                notes: true,
              },
            },
          },
        },
        guide: {
          include: {
            sections: {
              include: {
                content: {
                  include: {
                    metadata: true,
                  },
                },
                tasks: true,
                verifications: true,
              },
            },
          },
        },
        resources: true,
        settings: true,
      },
    });
  }

  static async deleteLab(id: string): Promise<Lab> {
    return prisma.lab.delete({ where: { id } });
  }

  static async updateLab(id: string, data: ILab) {
    const { environment, guide, resources, settings, ...labData } = data;

    const actions: Prisma.PrismaPromise<unknown>[] = [];
    // 🔷 Update lab basic info
    actions.push(
      prisma.lab.update({
        where: { id },
        data: labData,
      }),
    );

    // 🔷 Update environment
    if (environment) {
      const { topology, ...envData } = environment;

      actions.push(
        prisma.labEnvironment.update({
          where: { labId: id },
          data: {
            startupConfig: envData.startupConfig,
            type: envData.type,
          },
        }),
      );

      if (topology) {
        const { notes, nodes, links, ...topoData } = topology;

        if (!topology.environmentId)
          throw new Error("topology.environmentId is required");

        const topoId = topology.environmentId;
        console.log("🚀 ~ LabService ~ updateLab ~ topoId:", topoId);

        // 🔷 Update topology
        actions.push(
          prisma.networkTopology.update({
            where: { environmentId: topoId },
            data: {
              layout: topoData.layout,
            },
          }),
        );

        // 🔷 Notes
        actions.push(
          prisma.topologyNote.deleteMany({ where: { topologyId: topoId } }),
        );

        if (notes?.length) {
          actions.push(
            prisma.topologyNote.createMany({
              data: notes.map((n) => ({
                id: n.id,
                text: n.text,
                x: n.x,
                y: n.y,
                width: n.width,
                height: n.height,
                topologyId: topoId,
              })),
            }),
          );
        }

        // 🔷 Nodes
        actions.push(
          prisma.topologyNode.deleteMany({ where: { topologyId: topoId } }),
        );

        let nodeIds: string[] = [];

        if (nodes?.length) {
          const nodeData = nodes.map((n) => ({
            id: n.id,
            name: n.name,
            type: n.type,
            x: n.x,
            y: n.y,
            icon: n.icon,
            status: n.status,
            credentials: n.credentials,
            topologyId: topoId,
          }));

          actions.push(prisma.topologyNode.createMany({ data: nodeData }));

          nodeIds = nodes.map((n) => n.id);

          // 🔷 Interfaces
          const interfaceData = nodes.flatMap((node) =>
            (node.interfaces ?? []).map((iface) => ({
              id: iface.id,
              name: iface.name,
              ipAddress: iface.ipAddress,
              subnet: iface.subnet,
              enabled: iface.enabled,
              status: iface.status,
              topologyNodeId: node.id,
            })),
          );

          if (interfaceData.length) {
            actions.push(
              prisma.deviceInterface.deleteMany({
                where: { topologyNodeId: { in: nodeIds } },
              }),
            );

            actions.push(
              prisma.deviceInterface.createMany({
                data: interfaceData,
              }),
            );
          }
        }

        // 🔷 Links
        actions.push(
          prisma.topologyLink.deleteMany({ where: { topologyId: topoId } }),
        );

        if (links?.length) {
          actions.push(
            prisma.topologyLink.createMany({
              data: links.map((l) => ({
                id: l.id,
                source: l.source,
                target: l.target,
                sourcePort: l.sourcePort,
                targetPort: l.targetPort,
                status: l.status,
                topologyId: topoId,
              })),
            }),
          );
        }
      }
    }

    // 🔷 Update guide
    if (guide) {
      const { sections, ...guideData } = guide;

      actions.push(
        prisma.labGuide.update({
          where: { labId: guide.labId },
          data: guideData,
        }),
      );

      // Delete old sections (and their children if FK `ON DELETE CASCADE` isn’t enabled)
      actions.push(
        prisma.labSection.deleteMany({ where: { guideId: guide.labId } }),
      );

      // Recreate sections & their children
      for (const section of sections ?? []) {
        const { tasks, verifications, content, ...sectionData } = section;

        actions.push(
          prisma.labSection.create({
            data: {
              ...sectionData,
              guideId: guide.labId,
              tasks: {
                create:
                  tasks?.map((t) => ({
                    description: t.description,
                    device: t.device,
                    isCompleted: t.isCompleted,
                    hints: t.hints,
                    commands: t.commands,
                    expectedResult: t.expectedResult,
                  })) ?? [],
              },
              verifications: {
                create:
                  verifications?.map((v) => ({
                    requiresScreenshot: v.requiresScreenshot,
                    description: v.description,
                    commands: v.commands,
                    expectedOutput: v.expectedOutput,
                    device: v.device,
                    isCompleted: v.isCompleted,
                  })) ?? [],
              },
              content: {
                create:
                  content?.map((c) => ({
                    type: c.type,
                    content: c.content,
                    metadata: {
                      create: {
                        language: c.metadata?.language,
                        device: c.metadata?.device,
                        command: c.metadata?.command,
                        expected_output: c.metadata?.expected_output,
                        callout_type: c.metadata?.callout_type ?? "info",
                      },
                    },
                  })) ?? [],
              },
            },
          }),
        );
      }
    }

    // 🔷 Update resources
    if (resources) {
      actions.push(prisma.labResource.deleteMany({ where: { labId: id } }));

      if (resources.length) {
        actions.push(
          prisma.labResource.createMany({
            data: resources.map((r) => ({
              ...r,
              labId: id,
            })),
          }),
        );
      }
    }

    if (settings) {
      actions.push(
        prisma.labSettings.upsert({
          where: { labId: id },
          update: {
            labId: id,
            disableInteractiveLab: settings.disableInteractiveLab,
            visible: settings.visible,
            maxAttemptSubmission: settings.maxAttemptSubmission,
            noLateSubmission: settings.noLateSubmission,
            onForceExitUponTimeout: settings.onForceExitUponTimeout,
          },
          create: {
            labId: id,
            disableInteractiveLab: settings.disableInteractiveLab,
            visible: settings.visible,
            maxAttemptSubmission: settings.maxAttemptSubmission,
            noLateSubmission: settings.noLateSubmission,
            onForceExitUponTimeout: settings.onForceExitUponTimeout,
          },
        }),
      );
    }

    // 🚀 Run all actions atomically
    await prisma.$transaction(actions);
  }
}
