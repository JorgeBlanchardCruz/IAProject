using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace GeneradorMapa
{
    public partial class Form1 : Form
    {
      private string entrada;
      private Cuadricula tab_;
      private int selected_;
      private bool creado_;
      private Robot robot_;

    //  public string prueba;
        public Form1()
        {
        //    prueba = "hola";
            robot_ = null;
            creado_ = false;
            entrada = null;
            selected_ = -1;
           // _C = new System.Windows.Forms.Label(); ;
            tab_ = new Cuadricula(0, 0, 0,this);
            InitializeComponent();
            //this.Opacity = .75;
            this.WindowState = FormWindowState.Maximized;
            //Paleta p = new Paleta();
           // p.Show();
        }

        private void crearToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (!creado_)
            {
                Form2 f = new Form2(this);
                f.Show();
                
            }
        }
        private void generarToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (creado_)
            generarFichero();
        }
        public void CrearTabla()
        {
            string [] cad = entrada.Split('x');
            bool ok = true;
            try
            {
                Convert.ToInt32(cad[0]);
                Convert.ToInt32(cad[1]);
                Convert.ToInt32(cad[2]);
            }
            catch (FormatException)
            {
                ok = false;
                MessageBox.Show("Debe ser formato COLUMNASxFILASxOBSTACULOS");
            }
       
            if (ok)
            {
                //this.SuspendLayout();
                tab_ = new Cuadricula(Convert.ToInt32(cad[0]), Convert.ToInt32(cad[1]), Convert.ToInt32(cad[2]),this);
                for (int i = 0; i < tab_.get_rows(); i++)
                {
                    for (int j = 0; j < tab_.get_columns(); j++)
                    {
                        this.panel.Controls.Add(this.tab_.get_Celda(i, j));
                        this.tab_.get_Celda(i, j).Click += new System.EventHandler(this.tab_.get_Celda(i, j).Celda_Click);
                    }
                }
               // this.ResumeLayout(false);
                creado_ = true;
            }
           // MessageBox.Show(prueba);
        }
        private void generarFichero()
        {
            string[] cad = entrada.Split('x');
            bool ok = true;
            List<string> texto = new List<string>();
            bool inicio = false;
            bool final = false;

            texto.Add("blocks");
            texto.Add(cad[1] + "x" + cad[0]);


            for (int i = 0; i < tab_.get_rows(); i++)
            {
                for (int j = 0; j < tab_.get_columns(); j++)
                {
                    if (tab_.get_Celda(i, j).get_index() == 1)
                    {
                        if (!inicio)
                        {
                            inicio = true;
                            texto.Add(Convert.ToString(j) + "," + Convert.ToString(i));
                            robot_ = new Robot(0, 0, i, j, this);

                        }
                        else
                            ok = false;

                    }
                    else if (tab_.get_Celda(i, j).get_index() == 2)
                    {
                        if (!final)
                            final = true;
                        else
                            ok = false;
                    }
                }
            }
            generar_recorrido();
            texto.Add(robot_.get_trayectoria().get_trayectoria());
            for (int i = 0; i < tab_.get_rows(); i++)
            {
                for (int j = 0; j < tab_.get_columns(); j++)
                {
                    if (tab_.get_Celda(i, j).get_index() != 0 && tab_.get_Celda(i, j).get_index() != 1)
                    {
                        texto.Add(Convert.ToString(j) + "," + Convert.ToString(i) + ";" + Convert.ToString(tab_.get_Celda(i, j).get_index()));

                    }
                }

            }

           

            if (ok)
            {/////PROBLEMAS CON EL PATH, Hay q buscar la forma de hacerlo relativo

                using (System.IO.TextWriter mapa = new System.IO.StreamWriter(@"C:\Users\Sabato\mapa.map"))
                {
                    texto.ForEach(delegate(string ln)
                    {
                        mapa.WriteLine(ln);
                    });


                }
            }
               // MessageBox.Show(texto[2]);
        }


        private void generar_recorrido()
        {
            robot_.get_method().run();
        }
        public string getent() { return entrada; }
        public void setent(string s) {  entrada = s; }
        public int get_selected() { return selected_; }
        public Cuadricula get_tab() { return tab_; }
        private void Form1_Paint(object sender, PaintEventArgs e)
        {
          
        }

     
        private void pic1_Click(object sender, EventArgs e)
        {
            this.pictureBox1.Image = global::GeneradorMapa.Properties.Resources.blancoM;
            
            switch (selected_)
            {
                case 1: this.pictureBox2.Image = global::GeneradorMapa.Properties.Resources.rojo; break;
                case 2: this.pictureBox3.Image = global::GeneradorMapa.Properties.Resources.azul; break;
                case 3: this.pictureBox4.Image = global::GeneradorMapa.Properties.Resources.water; break;
                case 4: this.pictureBox5.Image = global::GeneradorMapa.Properties.Resources.verde; break;
                default: break;
            }
            selected_ = 0;
        }
        private void pic2_Click(object sender, EventArgs e)
        {
            this.pictureBox2.Image = global::GeneradorMapa.Properties.Resources.rojoM;
            switch (selected_)
            {
                case 0: pictureBox1.Image = global::GeneradorMapa.Properties.Resources.blanco; break;
                case 2: this.pictureBox3.Image = global::GeneradorMapa.Properties.Resources.azul; break;
                case 3: this.pictureBox4.Image = global::GeneradorMapa.Properties.Resources.water; break;
                case 4: this.pictureBox5.Image = global::GeneradorMapa.Properties.Resources.verde; break;
            }
            selected_ = 1;
        }
        private void pic3_Click(object sender, EventArgs e)
        {
            this.pictureBox3.Image = global::GeneradorMapa.Properties.Resources.azulM;
            switch (selected_)
            {
                case 1: pictureBox2.Image = global::GeneradorMapa.Properties.Resources.rojo; break;
                case 0: this.pictureBox1.Image = global::GeneradorMapa.Properties.Resources.blanco; break;
                case 3: this.pictureBox4.Image = global::GeneradorMapa.Properties.Resources.water; break;
                case 4: this.pictureBox5.Image = global::GeneradorMapa.Properties.Resources.verde; break;
            }
            selected_ = 2;
        }
        private void pic4_Click(object sender, EventArgs e)
        {
            this.pictureBox4.Image = global::GeneradorMapa.Properties.Resources.waterM;
            switch (selected_)
            {
                case 1: pictureBox2.Image = global::GeneradorMapa.Properties.Resources.rojo; break;
                case 2: this.pictureBox3.Image = global::GeneradorMapa.Properties.Resources.azul; break;
                case 0: this.pictureBox1.Image = global::GeneradorMapa.Properties.Resources.blanco; break;
                case 4: this.pictureBox5.Image = global::GeneradorMapa.Properties.Resources.verde; break;
            }
            selected_ = 3;
        }
        private void pic5_Click(object sender, EventArgs e)
        {
            this.pictureBox5.Image = global::GeneradorMapa.Properties.Resources.verdeM;
            switch (selected_)
            {
                case 1: pictureBox2.Image = global::GeneradorMapa.Properties.Resources.rojo; break;
                case 2: this.pictureBox3.Image = global::GeneradorMapa.Properties.Resources.azul; break;
                case 3: this.pictureBox4.Image = global::GeneradorMapa.Properties.Resources.water; break;
                case 0: this.pictureBox1.Image = global::GeneradorMapa.Properties.Resources.blanco; break;
            }
            selected_ = 4;
        }
    }
}
